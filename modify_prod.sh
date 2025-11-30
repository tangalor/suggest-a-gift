#!/bin/bash

# Configurazione nomi file
INPUT_FILE="products_5000.json"
OUTPUT_FILE="products_5000_modificato.json"
TAG_STRING="/?tag=suggestgift77-21"

echo "--- Inizio elaborazione ---"

# Verifica se il file di input esiste
if [ ! -f "$INPUT_FILE" ]; then
    echo "Errore: Il file $INPUT_FILE non esiste nella cartella corrente."
    exit 1
fi

# METODO 1: Utilizzando SED (Standard, non richiede installazioni extra)
# Questo comando cerca il pattern "link": "..." e appende il tag alla fine dell'URL, prima delle virgolette di chiusura.
# Spiegazione regex: Cattura ("link": " + tutto tranne virgolette) e lo sostituisce con (se stesso + tag)

echo "Elaborazione in corso con sed..."
sed 's|\("link": "[^"]*\)|\1'"$TAG_STRING"'|g' "$INPUT_FILE" > "$OUTPUT_FILE"

# Verifica del risultato
if [ $? -eq 0 ]; then
    echo "Successo! File creato: $OUTPUT_FILE"
    
    # Mostra un'anteprima delle prime righe modificate per conferma
    echo ""
    echo "Anteprima delle modifiche (prime 3 occorrenze):"
    grep "link" "$OUTPUT_FILE" | head -n 3
else
    echo "Si è verificato un errore durante la creazione del file."
fi

echo "--- Fine ---"
