# Come Creare le Icone per l'Estensione

## Metodo Rapido (Online - Consigliato)

### 1. Usa un generatore di emoji/icone:
- Vai su: https://favicon.io/favicon-generator/
- Oppure: https://www.favicon-generator.org/

### 2. Configurazione suggerita:
- **Testo**: "DC" o "📊"
- **Sfondo**: #2d5016 (verde)
- **Testo**: #ffd700 (oro)
- **Font**: Bold, Arial o simile
- **Forma**: Quadrato con angoli arrotondati

### 3. Download e rinomina:
- Scarica le icone generate
- Rinomina i file in:
  - `icon16.png` (16x16 pixel)
  - `icon48.png` (48x48 pixel)  
  - `icon128.png` (128x128 pixel)
- Salvali nella cartella `icons/`

---

## Metodo Alternativo (Figma/Canva)

1. Crea un design quadrato
2. Usa i colori del brand:
   - Verde: `#2d5016` o `#1a3a0f`
   - Oro: `#ffd700`
3. Aggiungi testo "DC" o icona 📊
4. Esporta in 3 dimensioni: 16px, 48px, 128px

---

## Metodo Veloce (Screenshot + Ridimensiona)

1. Apri il file `gift.png` dalla cartella principale
2. Ritaglia un'area quadrata
3. Ridimensiona a 128x128px, 48x48px, 16x16px
4. Salva come `icon128.png`, `icon48.png`, `icon16.png`

---

## Dopo aver creato le icone:

1. Salva i 3 file PNG in questa cartella (`icons/`)
2. Riabilita le icone nel `manifest.json` aggiungendo:

```json
"icons": {
  "16": "icons/icon16.png",
  "48": "icons/icon48.png",
  "128": "icons/icon128.png"
}
```

3. Ricarica l'estensione su `chrome://extensions/`

---

## Note:
- L'estensione funziona anche SENZA icone personalizzate
- Chrome userà un'icona predefinita se le icone mancano
- Le icone servono principalmente per estetica nel Chrome Web Store
