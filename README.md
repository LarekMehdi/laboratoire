# laboratoire

# 1. Installation

### Prérequis
- Node.js version 20.x ou supérieure
- NPM version 9.x ou supérieure
- TypeScript version 5.x



# Commandes pour installer les dépendances
```bash
npm install
```


# 2. Exécution

### Exécuter le code 
```bash
npm run dev
```

# 3. Choix de développement

- Entités métier (classes): Les entités métier sont des classes afin de pouvoir ajouter facilement des méthodes et comportements spécifiques à chaque objet, encapsuler les données et profiter de l’héritage si nécessaire.

- Interfaces: Les interfaces sont utilisées pour typer des objets qui ne nécessitent pas de comportement, seulement une structure (ex. ScheduleSlot, ScheduleOutput). Cela permet de garantir la conformité des données tout en restant léger et indépendant de l’implémentation.

- Avantage du mix classes/interfaces: Cette approche permet de séparer clairement la logique métier (classes) et les structures de données (interfaces), tout en conservant un typage strict et une organisation claire du code.

- Services (classes abstraites avec méthodes statiques): Les services sont implémentés en classes abstraites avec méthodes statiques afin d’éviter l’instanciation et les problèmes de dépendances entre classes. Ce choix simplifie l’accès aux fonctionnalités depuis n’importe quel endroit du code sans avoir besoin de passer par un constructeur ou une injection de dépendance. Cela renforce la réutilisabilité et réduit le couplage.

- Utils (classes utilitaires): Les classes utilitaires suivent la même structure que les services (classes abstraites avec méthodes statiques) mais se différencient par leur caractère généraliste. Elles contiennent des fonctions réutilisables dans tout le projet, indépendantes de la logique métier spécifique, comme le formatage des dates (UtilDate), les arrondis et calculs numériques (UtilNumber), ou la transformation d’objets entre structures (UtilMapper). Ce découpage favorise la réutilisabilité, la clarté du code et la séparation des responsabilités.

- Constantes: Toutes les constantes sont définies sous forme d’enum et centralisées dans un dossier dédié. Cela permet de garantir la cohérence des valeurs utilisées dans l’ensemble du projet, d’éviter les erreurs liées aux chaînes de caractères ou nombres magique, et de faciliter la maintenance et l’évolution.

# 4. Point d'entrée
**planification.ts**

- Rôle: Ce fichier contient la fonction planifyLab, qui constitue le point d’entrée principal pour l’ordonnancement des échantillons. Elle reçoit un objet InputData (samples, technicians, equipment), et retourne un objet OutputData contenant le planning et les métriques associées.

Ce point d’entrée illustre comment les différentes couches (classes métiers, services, utils et constantes) interagissent. Les entités encapsulent les données métier, les services gèrent la logique (planification et métriques), les utils fournissent des fonctions réutilisables (tri, regroupement, mapping), et les constantes assurent la cohérence des valeurs utilisées dans tout le projet.

# 5. Dolléances

Le calcul de l'efficacité et du temps total ne semble pas correspondre entre les sorties attendus et le calcul décrit dans le cdc.

Il est dit ceci dans le cdc: 

**Temps total** : Durée entre le début de la première analyse et la fin de la dernière analyse.
Pourtant, pour les résultats attendus on peux lire ceci:
"totalTime": 105,       // 09:30 à 10:45 = 1h15 = 75min

Le totalTime est de 105, ce qui correspond en réalité à la différence entre l’heure d’arrivée la plus tôt d’un échantillon (ici 09:00 pour S001) et la fin de la dernière analyse planifiée (10:45 pour S001).

**input**
```bash
{
  "samples": [
    {
      "id": "S001",
      "type": "BLOOD",
      "priority": "URGENT", 
      "analysisTime": 45,
      "arrivalTime": "09:00",
      "patientId": "P001"
    },
    {
      "id": "S002", 
      "type": "BLOOD",
      "priority": "STAT",
      "analysisTime": 30,
      "arrivalTime": "09:30",
      "patientId": "P002"
    }
  ],
  "technicians": [
    {
      "id": "T001",
      "speciality": "BLOOD", 
      "startTime": "08:00",
      "endTime": "17:00"
    }
  ],
  "equipment": [
    {
      "id": "E001",
      "type": "BLOOD",
      "available": true
    }
  ]
}
```

**output:**
```bash
{
  "schedule": [
    {
      "sampleId": "S002",     // STAT en premier ! 
      "technicianId": "T001",
      "equipmentId": "E001", 
      "startTime": "09:30",   // Dès son arrivée
      "endTime": "10:00",
      "priority": "STAT"
    },
    {
      "sampleId": "S001",     // URGENT après
      "technicianId": "T001",
      "equipmentId": "E001",
      "startTime": "10:00",   // Attend la fin du STAT
      "endTime": "10:45", 
      "priority": "URGENT"
    }
  ],
  "metrics": {
    "totalTime": 105,       // 09:30 à 10:45 = 1h15 = 75min
    "efficiency": 71.4,     // (75min d'analyses) / (105min total)
    "conflicts": 0
  }
}
```

N'étant pas certain du bon calcul du totalTime, l'efficacité ne peux pas être calculé correctement.


