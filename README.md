# Spring Exam Prep

Plateforme de revision Spring, JPA, Hibernate, REST et examens proposes par le professeur.

## Lancer en local

```bash
npm install
npm run dev
```

## Enregistrement des visiteurs

L'application demande un prenom et un nom avant l'acces. En production Vercel, la route `api/register.js` ajoute chaque entree dans `data/visitors.json` via l'API GitHub.

Variables d'environnement a configurer cote serveur, jamais dans le code frontend:

```bash
GITHUB_TOKEN=token_github_secret
GITHUB_OWNER=miissaouinaqrouz
GITHUB_REPO=missaoui-java
GITHUB_BRANCH=main
GITHUB_VISITORS_PATH=data/visitors.json
```

Le token GitHub doit avoir le droit d'ecriture sur le depot. Si un token a ete partage publiquement, il faut le revoquer puis en creer un nouveau.
