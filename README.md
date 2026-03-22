# CodeQuest — Le Labo de l'Inventeur

Application web de cours de programmation Java gamifié.  
BTEC HND Unit 1: Programming — LO3 & LO4

## Déploiement sur Vercel

1. Forker ou cloner ce repo
2. Aller sur [vercel.com](https://vercel.com)
3. "New Project" → Importer depuis GitHub → Sélectionner ce repo
4. Framework: Create React App (auto-détecté)
5. Cliquer "Deploy"
6. Le site est en ligne !

## Développement local

```bash
npm install
npm start
```

## Structure

```
src/
├── App.js              # Portail principal + navigation
├── index.js            # Point d'entrée
└── modules/
    ├── M01_Unified_Conditions.js
    ├── M02_Unified_Boucles.js
    ├── M03_Unified_OOP.js
    ├── M04_Unified_Data.js
    └── M05_Unified_Heritage.js
```

## Modules disponibles

| Module | Contenu | Statut |
|--------|---------|--------|
| M01 | Conditions (if/else, switch, &&, \|\|) | ✅ |
| M02 | Boucles (for, while, break) | ✅ |
| M03 | POO (classe, constructeur, getter/setter) | ✅ |
| M04 | Data (String, ArrayList, CRUD) | ✅ |
| M05 | Héritage (extends, super, polymorphisme) | ✅ |
| M06-M13 | En cours de développement | 🔄 |
