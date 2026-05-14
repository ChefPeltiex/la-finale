/**
 * Migre une fois les clés localStorage/sessionStorage du préfixe historique vers Egor69.
 * Doit s'exécuter avant tout import qui lit le stockage applicatif.
 */
function migrateLegacyBrandStorageOnce() {
  if (typeof localStorage === "undefined") return;

  const flag = "igor:storage:migrated-from-peltiez:v1";
  try {
    if (localStorage.getItem(flag)) return;
  } catch {
    return;
  }

  const migrateStore = (store) => {
    if (!store || typeof store.length !== "number") return;
    const keys = [];
    for (let i = 0; i < store.length; i++) {
      const k = store.key(i);
      if (k && (k.startsWith("peltiez:") || k.startsWith("peltiez_"))) keys.push(k);
    }
    for (const k of keys) {
      const nk = k.startsWith("peltiez:")
        ? `igor:${k.slice("peltiez:".length)}`
        : `igor_${k.slice("peltiez_".length)}`;
      try {
        if (store.getItem(nk) == null) {
          store.setItem(nk, store.getItem(k));
        }
        store.removeItem(k);
      } catch {
        // ignore quota / private mode
      }
    }
  };

  try {
    migrateStore(localStorage);
    migrateStore(sessionStorage);
    localStorage.setItem(flag, "1");
  } catch {
    // ignore
  }
}

migrateLegacyBrandStorageOnce();

export {};
