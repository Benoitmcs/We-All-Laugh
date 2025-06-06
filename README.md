1. High-level Architecture
Tier	What runs there	Key libs / services
Front-end (browser)	• React 19 SPA (or Next.js 15 in “static export” mode)
• @react-three/fiber + three.js + @react-three/drei for the 3-D viewer
• Stripe.js + Stripe Checkout embedded components	3-D interactivity handled completely client-side; all sensitive Stripe actions take place server-side for security
Back-end API (container)	• Node 20 + Express
• Stripe Node SDK ≥ v18 (current preview pins API version 2025-04-30﻿) 
github.com
github.com
Creates Checkout Sessions, stores orders, signs URLs for model assets, etc.
Data	• Cloud SQL (PostgreSQL) or Firestore (if you prefer serverless)	very small footprint at launch—an object store would even work
Hosting & CI/CD	• Google Cloud Build pipeline → Cloud Run (fully managed) for the container 
cloud.google.com
cloud.google.com
Auto-build on each push to main; Cloud Run gives HTTPS, scaling-to-zero, and IAM-based secrets

2. Suggested Repository & Folder Layout
bash
Copy
Edit
/tshirt-platform
├── client/                 # React or Next.js front-end
│   ├── public/models/      # GLB/GLTF T-shirt meshes
│   └── src/
│       ├── components/     # 3-D viewer, product cards, cart, etc.
│       └── pages/          # (if using Next.js)
├── server/                 # Node/Express API
│   ├── routes/
│   │   └── checkout.js     # POST /api/checkout
│   └── models/             # DB models (Prisma, Sequelize, etc.)
├── .dockerignore
├── Dockerfile              # multi-stage (see below)
├── docker-compose.yml      # local dev: db + app
└── cloudbuild.yaml         # CI/CD pipeline for Cloud Build
3. Key Front-end Pieces
3-D T-Shirt Viewer
tsx
Copy
Edit
// client/src/components/TShirtViewer.tsx
import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';

export default function TShirtViewer({ modelUrl, color }) {
  const { scene } = useGLTF(modelUrl);
  return (
    <Canvas camera={{ position: [0, 1.2, 2.2], fov: 45 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 3, 3]} intensity={0.8} />
      <primitive
        object={scene}
        material-color={color}
        dispose={null}
      />
      <OrbitControls enablePan={false} />
      <Environment preset="studio" />
    </Canvas>
  );
}
Why this stack?
react-three-fiber v9 is React-19-ready and brings massive performance gains; drei cuts boilerplate for loaders, orbit controls, HDRI, etc. 
github.com
github.com

Checkout Flow (client-side)
User clicks “Buy now” → POST /api/checkout with chosen SKU/quantity.

API returns sessionId.

Call stripe.redirectToCheckout({ sessionId }).

Stripe Checkout’s hosted form keeps PCI DSS off your server and is now available as an embedded component if you want it to appear modally instead of redirecting 
docs.stripe.com
.

4. Back-end Highlights
js
Copy
Edit
// server/routes/checkout.js
import Stripe from 'stripe';
import express from 'express';
const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-04-30.preview',   // keep in sync with pinned version
});

router.post('/', async (req, res) => {
  const { skuId, quantity = 1 } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        price: skuId,       // pre-created in Stripe Dashboard
        quantity,
      }],
      automatic_tax: { enabled: true },
      success_url: `${process.env.FRONTEND_URL}/success?sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
    });
    res.json({ sessionId: session.id });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Stripe session failed' });
  }
});

export default router;
Security note: The secret key never touches the client; use Cloud Run → “Variables & secrets” to inject it at runtime.

5. Dockerfile (multi-stage)
dockerfile
Copy
Edit
# ---------- 1) Build front-end ----------
FROM node:20 AS builder
WORKDIR /app
COPY client/package*.json ./client/
RUN cd client && npm ci
COPY client ./client
RUN cd client && npm run build      # outputs to client/dist or .next

# ---------- 2) Build back-end ----------
FROM node:20-slim
WORKDIR /app
COPY server/package*.json ./
RUN npm ci
COPY server ./                      # Express source
COPY --from=builder /app/client/dist ./public   # or .next/static

ENV PORT=8080
EXPOSE 8080
CMD ["node", "index.js"]
Local dev: docker-compose up --build spins Node, Postgres, and a hot-reload React dev server.

6. Google Cloud CI/CD
Cloud Storage → Artifacts (optional) – store 3-D models and large media.

Cloud SQL – provision Postgres, set private IP if you need VPC.

Cloud Build trigger on main pushes:

yaml
Copy
Edit
# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', '${_IMAGE}', '.']
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', '${_IMAGE}']
  - name: 'gcr.io/google.com/cloudsdktool/cloud-sdk'
    args: ['gcloud', 'run', 'deploy', 'tshirt-api',
           '--image', '${_IMAGE}', '--region', 'us-west1',
           '--allow-unauthenticated', '--platform', 'managed']
substitutions:
  _IMAGE: 'us-west1-docker.pkg.dev/$PROJECT_ID/tsite/tshirt:latest'
Steps follow the official quick-start docs for Cloud Run 
cloud.google.com
cloud.google.com
.

7. Nice-to-Haves & Future Switches
Upgrade	Benefit
Next.js → app/ router + React Server Components	Static marketing pages pre-rendered, dynamic cart still client-side
PlanetScale or Neon for DB	If Postgres with branching fits better than Cloud SQL
Kraken.js or zod on API	Runtime validation of incoming JSON, safer Stripe webhooks
CMS (e.g., Sanity v4)	Non-dev staff can add new T-shirt designs without code
Model customization	Pass user-selected colors or uploaded textures into the 3-D shader; memoise materials for performance

8. Implementation Checklist
Model pipeline – export GLB files < 5 MB (use Draco compression).

Stripe products & prices – set SKUs in dashboard; copy IDs into .env.

Local smoke test – curl -X POST localhost:8080/api/checkout returns Session ID.

CI push – push to GitHub → Cloud Build triggers → Cloud Run URL issued.

DNS & HTTPS – map domain to Cloud Run; SSL cert autoprovisioned.

Observability – enable Cloud Logging & Error Reporting; set up an alert for 5xx counts.
