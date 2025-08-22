# 📝 Sujet de TP : Gestion du contexte utilisateur dans l’application Angular

Nous avons mis en place une petite application Angular communiquant avec une API locale simple.
Après avoir mis en place l'authentification et la gestion d'utilisateur, nous voudrions rajouter différentes fonctionnalités a notre application.

## 🎯 Objectif

Mettre en place un UserContext (service Angular) permettant de stocker et partager les informations de l’utilisateur connecté dans toute l’application.

Vous utiliserez ce contexte pour enrichir l’expérience utilisateur et éviter les appels API inutiles.

## 🚀 Fonctionnalités à implémenter

### 1. Mise en place du contexte utilisateur

Créer un service Angular UserContextService.

Il doit :

Stocker les informations de l’utilisateur connecté,
fournir un observable pour que les composants puissent réagir aux changements,
proposer des méthodes (setUser(), getUser(), clearUser()).

Ce service doit être injecté dans le AppComponent et initialisé au login.

### 2. Barre de navigation dynamique

Ajouter une navbar affichant les infos de l’utilisateur connecté (nom, avatar, rôle).
La navbar doit se mettre à jour automatiquement quand l’utilisateur change (grâce au contexte).

### 3. 🎨 Personnalisation du thème (100% front)

Ajouter une option permettant à l’utilisateur de choisir entre mode clair et mode sombre.
Le choix doit être stocké en localStorage (donc persistant après refresh).

La navbar et la page paramètres doivent refléter le thème choisi.

## ⭐ Bonus (si temps restant)

Sauvegarder le contexte en localStorage pour que l’utilisateur reste connecté après un refresh.

## ✅ Livrables

Un composant UserContext fonctionnel. (celui ci fais appel aux méthodes des autres services)
Une navbar dynamique liée au contexte.
Les différentes pages doivent s'afficher avec le thème sombre.
