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

# 3. Dolléances

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


