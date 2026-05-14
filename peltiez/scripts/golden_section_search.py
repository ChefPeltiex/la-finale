"""Compatibilité : réexporte le module canonique `golden_search`."""

from golden_search import golden_section_search, phi

__all__ = ["golden_section_search", "phi"]

if __name__ == "__main__":
    import runpy

    runpy.run_module("golden_search", run_name="__main__")
