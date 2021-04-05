import { D1ManifestDefinitions } from 'app/destiny1/d1-definitions';
import { D2ManifestDefinitions } from 'app/destiny2/d2-definitions';
import { t } from 'app/i18next-t';
import { knownModPlugCategoryHashes, LockedMods } from 'app/loadout-builder/types';
import { AppIcon, faExclamationTriangle } from 'app/shell/icons';
import { chainComparator, compareBy } from 'app/utils/comparators';
import React, { useMemo } from 'react';
import SavedModCategory from './SavedModCategory';
import styles from './SavedMods.m.scss';

interface Props {
  defs: D1ManifestDefinitions | D2ManifestDefinitions;
  savedMods: LockedMods;
  onOpenModPicker(): void;
  removeModByIndex(index: number): void;
}

/**
 * Component for managing mods associated to a loadout.
 */
function SavedMods({ defs, savedMods, onOpenModPicker, removeModByIndex }: Props) {
  const groupedMods = useMemo(() => {
    if (!defs.isDestiny2()) {
      return [];
    }

    const groups = Object.values(savedMods);

    return groups.sort(
      chainComparator(
        compareBy((mods) => {
          const plugCategoryHash = mods?.[0].modDef.plug.plugCategoryHash || -1;
          // We sort by known knownModPlugCategoryHashes so that it general, helmet, ..., classitem, raid, others.
          const knownIndex = knownModPlugCategoryHashes.indexOf(plugCategoryHash);
          return knownIndex === -1 ? knownModPlugCategoryHashes.length : knownIndex;
        }),
        compareBy((mods) => mods?.[0]?.modDef.itemTypeDisplayName)
      )
    );
  }, [savedMods, defs]);

  if (!defs.isDestiny2() || !Object.keys(savedMods).length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.title}>{t('Loadouts.Mods')}</div>
      </div>
      <div className={styles.categories}>
        {groupedMods.map((group) =>
          group?.length ? (
            <SavedModCategory
              defs={defs}
              mods={group}
              onRemove={(index: number) => removeModByIndex(index)}
              onOpenModPicker={onOpenModPicker}
            />
          ) : null
        )}
      </div>
      <div className={styles.disclaimer}>
        <AppIcon className={styles.warningIcon} icon={faExclamationTriangle} />
        {t('Loadouts.ModsInfo')}
      </div>
    </div>
  );
}

export default SavedMods;
