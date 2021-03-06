# Traductions

* Le module de traduction utilisé est [i18next](https://www.i18next.com/).
* La configuration se trouve [coté front-end](src/front-end/typescript/lib/i18n)
* Les traductions sont transpilées à même le code javascript.
* L'application côté serveur n'utilise pas encore de traduction.

## Implantation

### Texte simple

Utiliser la function `t` :

```jsx
import React from 'react'
import { useTranslation } from 'react-i18next';

const monComposant = () => {
  const { t } = useTranslation()
  return <div>{t('cle.traduction')}</div>
}
```

Exemple de traduction:

```json
{
  "cle": {
    "traduction": "Lorem ipsum"
  }
}
```

### Texte contenant des balises HTML

Utiliser le composant React `<Trans />` :

```jsx
import React from 'react'
import { Trans } from 'react-i18next';

const monComposant = () => {
  return <div><Trans i18nKey="cle.traduction" /></div>
}
```

Exemple de traduction:

```json
{
  "cle": {
    "traduction": "Lorem <i>ipsum</i>"
  }
}
```

### Images

Il est possible de changer d'image selon la langue :

```jsx
<img src={t('cle.traduction')}/>
```

### Liens HTML

Il est recommandé de traduire séparément le texte et l'URL du lien :

```jsx
<a href={t('cle.lien.href')}>{t('cle.lien.content')}</a>
```

## Détecter les termes non traduits

Exécuter la commande NPM :

```bash
npm i i18next-parser # N'est pas installé par défaut car la version actuelle contient des dépendances obsolètes
npm run i18n:parse
```

Les termes non traduits seront ajoutés aux fichiers de traduction [anglais](src/front-end/typescript/lib/i18n/locales/en/translation.json) et [français](src/front-end/typescript/lib/i18n/locales/fr/translation.json)

## Erreurs communes

### "Rendered more hooks than during the previous render."

Cette erreur arrive lorsqu'on utilise `useTranslation` dans un sous-composant React qui est créé selon qu'une condition est remplie ou non.
Lorsque cette erreur se produit, on le constate généralement par une page blanche. La trace de l'erreur s'affiche dans la console de débogage du navigateur.

Exemple:

```ts
// Bad :

const myConditionalComponent = () => {
  const { t } = useTranslation();
  return t('my.key')
}

function myParentComponent() {
  if (!sessionUser) {
    return myConditionalComponent();
  } else {
    return otherComponent();
  }
}
```

Pour corriger la situation, `useTranslation` doit exister autant de fois entre chaque `render` :

```ts
// Good :

const myConditionalComponent = (t: Function) => {
  return t('my.key')
}

function myParentComponent() {
  const { t } = useTranslation(); // Hook créé peu importe que la condition soit remplie ou non
  if (!sessionUser) {
    // la fonction `t` est passée en paramètre
    return myConditionalComponent(t);
  } else {
    return otherComponent();
  }
}
```
