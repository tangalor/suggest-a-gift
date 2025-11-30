# Data Collect - Chrome Extension per Amazon.it

Estensione Chrome per la raccolta e gestione dati prodotti Amazon.

## Versione 1.0.0

Prima versione con interfaccia laterale a linguetta per pagine Amazon.it

## Caratteristiche

- ✅ Pulsante a linguetta che esce dal lato destro della pagina
- ✅ Pannello laterale a tutta altezza con animazione slide
- ✅ Attivo solo su pagine `https://www.amazon.it/*`
- ✅ Design responsive e discreto
- ✅ Header con titolo "Data Collect"
- ✅ Pronto per le prossime funzionalità

## Installazione

1. Apri Chrome e vai su `chrome://extensions/`
2. Attiva la "Modalità sviluppatore" in alto a destra
3. Clicca su "Carica estensione non pacchettizzata"
4. Seleziona la cartella `chrome-extension-data-collect`
5. L'estensione sarà attiva su tutte le pagine Amazon.it

## Struttura File

```
chrome-extension-data-collect/
├── manifest.json      # Configurazione estensione
├── content.js         # Script principale
├── content.css        # Stili dell'interfaccia
├── icons/            # Icone dell'estensione (da creare)
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md         # Documentazione
```

## Come Usare

1. Naviga su una pagina Amazon.it
2. Vedrai un pulsante "Data Collect" sul lato destro della pagina
3. Clicca sul pulsante per aprire/chiudere il pannello laterale
4. Il pannello è pronto per ospitare le nuove funzionalità

## Sviluppo Futuro

Il pannello è pronto per implementare:
- Raccolta dati prodotti
- Export dati in vari formati
- Analisi e statistiche
- Gestione liste prodotti
- E altro ancora...

## Note Tecniche

- Manifest V3 (ultima versione)
- Content Script attivo solo su Amazon.it
- Stili non invasivi che non interferiscono con la pagina
- Z-index elevato per garantire visibilità
- Supporto navigazione SPA di Amazon

## Prossimi Passi

Dimmi cosa vuoi implementare nel pannello e procederò con lo sviluppo! 🚀
