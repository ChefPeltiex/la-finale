import os
import re
from pathlib import Path

try:
    from pypdf import PdfReader
except ImportError:
    from PyPDF2 import PdfReader

# Dossier de base
base_dir = r"C:\Users\CHEFP\OneDrive\Desktop\la finale"

# Liste des PDFs à inspecter
pdf_paths = [
    "public/encyclopedie/tome-I.pdf",
    "public/encyclopedie/tome-II.pdf",
    "public/encyclopedie/tome-III.pdf",
    "public/encyclopedie/tome-IV.pdf",
    "public/encyclopedie/tome-V.pdf",
    "public/encyclopedie/tome-VI.pdf",
    "public/encyclopedie/tome-VII.pdf",
    "public/encyclopedie.pdf",
    "docs/encyclopedie/codex-assembled-preview.pdf",
    "docs/encyclopedie/codex-assembled-with-text.pdf",
    "docs/CIRCULAI-SYNTHESE-COMPLETE.pdf",
    "docs/Egor69-Analyse-Plateforme.pdf",
    "docs/DOSSIER-STRATEGIQUE-Meeting-CirculAI-EGOR.pdf",
    "egor-time-sim/docs/EGOR-flou-temporel-LIVRET.pdf",
]

# Termes à chercher
search_terms = [
    "codex binaire",
    "binaire",
    "0 1",
    "01",
    "10",
]

# Regex pour les séquences binaires
binary_patterns = [
    r"\b0{2,}\b",  # 00, 000, etc.
    r"\b1{2,}\b",  # 11, 111, etc.
    r"\b[01]{4,}\b",  # Séquences binaires de 4+ chiffres
]

results = {}

print("=" * 80)
print("RECHERCHE DE 'CODEX BINAIRE' DANS LES PDFs")
print("=" * 80)

for pdf_file in pdf_paths:
    full_path = os.path.join(base_dir, pdf_file)
    
    if not os.path.exists(full_path):
        print(f"\n✗ {pdf_file} (NOT FOUND)")
        continue
    
    print(f"\n📄 Traitement: {pdf_file}")
    
    try:
        reader = PdfReader(full_path)
        num_pages = len(reader.pages)
        print(f"   Pages: {num_pages}")
        
        all_text = ""
        page_matches = {}  # {page_num: [(term, line), ...]}
        
        for page_num, page in enumerate(reader.pages, start=1):
            try:
                text = page.extract_text()
                if text:
                    all_text += text + "\n"
                    
                    # Chercher les termes
                    text_lower = text.lower()
                    for term in search_terms:
                        if term.lower() in text_lower:
                            if page_num not in page_matches:
                                page_matches[page_num] = []
                            # Extraire le contexte (100 chars autour du terme)
                            idx = text_lower.find(term.lower())
                            start = max(0, idx - 50)
                            end = min(len(text), idx + len(term) + 50)
                            context = text[start:end].replace('\n', ' ')
                            page_matches[page_num].append((term, context))
            except Exception as e:
                print(f"   Erreur page {page_num}: {e}")
        
        if page_matches:
            results[pdf_file] = {
                "found": True,
                "pages": page_matches,
                "num_pages": num_pages
            }
            print(f"   ✓ TROUVÉ SUR {len(page_matches)} PAGE(S)")
            for page_num, matches in sorted(page_matches.items()):
                for term, context in matches:
                    print(f"   - Page {page_num}: '{term}'")
                    print(f"     Contexte: ...{context[:80]}...")
        else:
            results[pdf_file] = {
                "found": False,
                "num_pages": num_pages
            }
            print(f"   ✗ PAS TROUVÉ")
    
    except Exception as e:
        print(f"   ERREUR: {e}")
        results[pdf_file] = {"error": str(e)}

# Résumé final
print("\n" + "=" * 80)
print("RÉSUMÉ FINAL")
print("=" * 80)

found_count = sum(1 for r in results.values() if r.get("found"))
total_count = len(results)

for pdf_file, data in results.items():
    status = "✓ TROUVÉ" if data.get("found") else "✗ PAS TROUVÉ"
    print(f"{status}: {pdf_file}")

print(f"\nRésultat: {found_count}/{total_count} PDFs contiennent 'codex binaire' ou termes associés")
