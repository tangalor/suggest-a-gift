#!/usr/bin/env python3
import json

# Mappatura per accorpare le categorie in 30 categorie principali
CATEGORY_MAPPING = {
    # Abbigliamento Uomo
    "Abbigliamento Uomo": ["Abbigliamento Uomo", "Pantaloni Uomo", "Camicia Uomo", "Giacca Uomo", 
                           "Maglietta Uomo", "Jeans Uomo", "Golf Uomo", "Polo Uomo", "Felpa Uomo", 
                           "Tuta Uomo", "Cappotto", "Giacca Invernale", "Costume da Bagno", "Maglietta",
                           "Calzamaglia"],
    
    # Abbigliamento Donna
    "Abbigliamento Donna": ["Abbigliamento Donna", "Polo Donna", "Pigiama Donna", "Tuta Donna", 
                            "Maglietta Donna"],
    
    # Abbigliamento Generale
    "Abbigliamento": ["Abbigliamento", "Moda", "Felpa"],
    
    # Scarpe e Calzature
    "Scarpe": ["Scarpe", "Scarpe Uomo", "Sandali", "Infradito", "Stivali", "Sneaker", "Calzini", 
               "Calzini Uomo"],
    
    # Accessori Abbigliamento
    "Accessori Abbigliamento": ["Guanti", "Cappello", "Berretto", "Sciarpa"],
    
    # Accessori Moda
    "Accessori": ["Accessori", "Accessori Donna", "Borse e Zaini", "Cintura Uomo", "Portafoglio", 
                  "Portachiavi", "Occhiali da Sole", "Gioielli", "Orologio", "Orologio Donna", 
                  "Smartwatch", "Orologio Uomo", "Cintura", "Cintura Pelle", "Borsa", "Zaino", 
                  "Zaino Uomo", "Valigia", "Portafoglio Uomo", "Portamonete", "Orecchini", "Spilla"],
    
    # Profumi e Cosmetica
    "Bellezza": ["Profumo", "Skincare", "Cosmetica", "Bellezza", "Cosmetici", "Profumi", 
                 "Shampoo", "Sapone", "Dentifricio", "Deodorante", "Haircare"],
    
    # Elettronica Consumer
    "Elettronica": ["Elettronica", "Tecnologia", "Tablet", "Smartphone", "Laptop", "Monitor", 
                    "Fotocamera", "Computer", "Tastiera"],
    
    # Audio e Multimedia
    "Audio": ["Cuffie", "Auricolari Wireless", "Audio", "Ventilatore USB"],
    
    # Accessori Tech
    "Accessori Tech": ["Caricabatterie", "Caricabatterie Veloce", "Cavo USB", "Powerbank", 
                       "Router WiFi"],
    
    # Gaming
    "Gaming": ["Gaming", "Action Figure", "Lego"],
    
    # Casa e Arredo
    "Casa": ["Casa", "Lampada LED", "Casa e Cucina", "Casa e Decorazione", "Coperta",
             "Tappeto", "Quadro", "Candela"],
    
    # Cucina e Tavola
    "Cucina": ["Cucina", "Posate", "Tazza", "Ufficio"],
    
    # Giardino
    "Giardino": ["Giardino", "Giardinaggio"],
    
    # Sport e Fitness
    "Sport": ["Sport", "Racchetta", "Bicicletta Bambino", "Fitness", "Kettlebell", 
              "Tappetino Yoga", "Cintura Massaggio"],
    
    # Giocattoli
    "Giocattoli": ["Giocattoli", "Giocattoli Bambini", "Giocattoli Educativi", "Macchinine", 
                   "Bambole", "Puzzle", "Trottola", "Squishy", "Stress Ball", "Aquilone",
                   "Frisbee"],
    
    # Giochi
    "Giochi": ["Giochi", "Giochi da Tavolo"],
    
    # Bambini 0-12 anni
    "Bambini": ["Bambino", "Bambino 0-3", "Bambino 3-6", "Neonato", "Bambino 6-12", "Adolescente"],
    
    # Libri e Lettura
    "Libri": ["Libri", "Lettura"],
    
    # Arte e Creatività
    "Arte": ["Arte", "Matite Colorate", "Marcatori", "Astuccio", "Forbici"],
    
    # Viaggi
    "Viaggio": ["Viaggio"],
    
    # Regali Speciali
    "Regali Speciali": ["Regalo", "Compleanno", "Natale", "Coppia", "Trending", "Sconto",
                        "Anniversario", "Sorpresa", "Deal del Giorno", "Offerta Speciale",
                        "Sconto Grande", "Regalo Lusso", "Regalo Premium", "Edizione Limitata",
                        "Nuovo Arrivo"],
    
    # Articoli Divertenti e Insoliti
    "Divertimento": ["Articoli Insoliti", "Olografico", "Vario", "Oggetti Bizzarri", "Vintage",
                     "Retro", "Classico", "Customizzato"],
    
    # Enogastronomia
    "Enogastronomia": ["Vino", "Dolci", "Birra", "Bevande", "Cibo", "Cioccolato", "Caramelle",
                       "Snack", "Tè"],
    
    # Animali
    "Animali": ["Animali", "Giocattolo Cane", "Tiragraffi"],
    
    # Musica
    "Musica": ["Musica"],
    
    # Uomo (categoria generica)
    "Per Lui": ["Uomo"],
    
    # Donna (categoria generica)
    "Per Lei": ["Donna"],
    
    # Anziani
    "Anziano": ["Anziano"],
    
    # Altro - categoria catch-all
    "Altro": ["Altro"],
}

# Crea un dizionario inverso per la mappatura veloce
inverse_mapping = {}
for target_category, source_categories in CATEGORY_MAPPING.items():
    for source_cat in source_categories:
        inverse_mapping[source_cat] = target_category

def consolidate_categories(input_file, output_file):
    """Legge il JSON, accorpa le categorie e salva il risultato"""
    
    print(f"Caricamento del file {input_file}...")
    with open(input_file, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"Trovati {len(products)} prodotti")
    
    # Statistiche
    categories_before = set()
    categories_after = set()
    unmapped_categories = set()
    
    # Accorpa le categorie
    for product in products:
        old_category = product.get('category', 'Altro')
        categories_before.add(old_category)
        
        # Trova la nuova categoria
        new_category = inverse_mapping.get(old_category)
        
        if new_category:
            product['category'] = new_category
            categories_after.add(new_category)
        else:
            unmapped_categories.add(old_category)
            # Se non trova mappatura, mette in "Altro"
            product['category'] = 'Altro'
            categories_after.add('Altro')
    
    # Salva il file modificato
    print(f"\nSalvataggio del file {output_file}...")
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(products, f, ensure_ascii=False, indent=2)
    
    # Stampa statistiche
    print(f"\n{'='*60}")
    print("STATISTICHE:")
    print(f"{'='*60}")
    print(f"Categorie originali: {len(categories_before)}")
    print(f"Categorie finali: {len(categories_after)}")
    print(f"\nCategorie finali create:")
    for cat in sorted(categories_after):
        count = sum(1 for p in products if p['category'] == cat)
        print(f"  - {cat}: {count} prodotti")
    
    if unmapped_categories:
        print(f"\n⚠️  Categorie non mappate (assegnate ad 'Altro'):")
        for cat in sorted(unmapped_categories):
            print(f"  - {cat}")
    
    print(f"\n✅ File salvato con successo!")

if __name__ == "__main__":
    input_file = "products_8211.json"
    output_file = "products_8211_consolidated.json"
    
    consolidate_categories(input_file, output_file)
