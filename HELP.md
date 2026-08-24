# Catalogo Flora - Guida Tecnica

## Panoramica

Questo progetto è un catalogo prodotti costruito con **Astro**. I dati dei prodotti vengono caricati dinamicamente da un **Google Sheet** pubblico durante il build del sito.

## Architettura

```
catalogo-flora/
├── src/
│   ├── pages/
│   │   └── index.astro        # Pagina principale del catalogo
│   ├── components/
│   │   ├── Header.astro       # Header del sito
│   │   ├── SpeciesAccordion.astro  # Accordion per gruppo di specie
│   │   ├── ProductRow.astro   # Riga singolo prodotto
│   │   └── RawDataModal.astro # Modal per visualizzare dati grezzi
│   └── lib/
│       └── products.ts        # Logica fetch e parsing dati
├── public/
│   └── images/                # Immagini dei prodotti
└── dist/                      # Output del build (generato)
```

## Fonte Dati: Google Sheet

### Dove si configura l'ID del foglio

L'ID del Google Sheet è definito in **`src/pages/index.astro`** (riga 12):

```typescript
const SHEET_ID = '1RRzln9ZGcdlhCPaUUqRskGJVRoWSIyWLKI_cCbCkUos';
```

### URL completo del foglio

```
https://docs.google.com/spreadsheets/d/1RRzln9ZGcdlhCPaUUqRskGJVRoWSIyWLKI_cCbCkUos
```

### Come funziona il caricamento

1. Durante il build, Astro chiama `fetchProducts()` da `src/lib/products.ts`
2. La funzione costruisce l'URL di export CSV: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/export?format=csv`
3. Scarica il CSV e lo parsa con la libreria **PapaParse**
4. I dati vengono trasformati in oggetti `Product` con campi normalizzati

### Struttura attesa del Google Sheet

| Colonna | Campo         | Descrizione         |
| ------- | ------------- | ------------------- |
| A (0)   | code          | Codice prodotto     |
| B (1)   | name          | Nome prodotto       |
| C (2)   | potSize       | Vaso                |
| D (3)   | pricePerPiece | € al pezzo          |
| E (4)   | pricePerBox   | € al cc (cassa)     |
| F (5)   | numPerBox     | N. per cassa        |
| G (6)   | numPerPlane   | N. per piano        |
| H (7)   | daGiardino    | Da giardino         |
| I (8)   | daGarden      | Da garden           |
| J (9)   | photo         | Foto (sempre vuoto) |
| K (10)  | note          | Note                |

**Importante:** Il foglio deve essere **pubblico** o condiviso con "Chiunque abbia il link".

## Immagini

### Dove si trovano

Le immagini dei prodotti sono in **`public/images/`**.

### Convenzione di naming

Il nome del file immagine deve corrispondere al **codice prodotto** + estensione `.jpeg`:

```
public/images/{codice}.jpeg
```

Esempi:

- Prodotto con codice `grca0100617` → `public/images/grca0100617.jpeg`
- Prodotto con codice `peli0200114` → `public/images/peli0200114.jpeg`

### Immagine di fallback

Se l'immagine non esiste, viene usata: `public/images/default.svg`

## Comandi

### Sviluppo locale

```bash
npm run dev
```

Avvia il server di sviluppo su `http://localhost:4321`

### Build per produzione

```bash
npm run build
```

Genera il sito statico nella cartella `dist/`

### Preview del build

```bash
npm run preview
```

Serve la cartella `dist/` localmente per verificare il build.

## Deploy

Il sito viene deployato automaticamente su **GitHub Pages** tramite GitHub Actions.

Il workflow è in `.github/workflows/deploy.yml` e si attiva ad ogni push sul branch principale.

## Modificare i Dati

### Per aggiornare i prodotti

1. Apri il Google Sheet
2. Modifica i dati
3. Rifai il build (`npm run build`) o aspetta il deploy automatico

### Per aggiungere un nuovo prodotto

1. Aggiungi una riga nel Google Sheet con codice e nome
2. (Opzionale) Aggiungi l'immagine in `public/images/{codice}.jpeg`
3. Rifai il build

### Per cambiare foglio sorgente

1. Apri `src/pages/index.astro`
2. Modifica la costante `SHEET_ID` con il nuovo ID
3. Assicurati che il nuovo foglio sia pubblico e abbia la stessa struttura

## Personalizzazione

### Etichette dei campi

Le etichette mostrate nel modal dei dati grezzi sono configurabili in `src/lib/products.ts`:

```typescript
export const FIELD_LABELS: Record<string, string> = {
  code: 'Codice',
  name: 'Nome',
  potSize: 'Vaso',
  pricePerPiece: '€ al pezzo',
  pricePerBox: '€ al cc',
  numPerBox: 'N. per cassa',
  numPerPlane: 'N. per piano',
  daGiardino: 'Da giardino',
  daGarden: 'Da garden',
  photo: 'Foto',
  note: 'Note',
};
```

### Mappatura colonne

Se la struttura del foglio cambia, aggiorna `COLUMN_NAMES` in `src/lib/products.ts`.

## Troubleshooting

### "Nessun prodotto disponibile"

- Verifica che il Google Sheet sia pubblico
- Controlla che l'ID sia corretto
- Verifica la connessione internet durante il build

### Immagini non visualizzate

- Verifica che il nome file corrisponda esattamente al codice (case-sensitive)
- Assicurati che l'estensione sia `.jpeg` (non `.jpg`)
- Controlla che l'immagine sia in `public/images/`

### Errori di parsing

- Verifica che il foglio abbia la struttura attesa
- Controlla che non ci siano righe vuote problematiche
