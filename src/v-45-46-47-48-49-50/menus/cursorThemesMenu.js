import Gio from 'gi://Gio';
import St from 'gi://St';
import updateOrnament from '../utils/updateOrnament.js';
import * as AnimationUtils from 'resource:///org/gnome/shell/misc/animationUtils.js';

import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';

import GNOME_SHELL_VERSION from '../utils/shellVersion.js';
import getCursorThemes from '../getNamesAsync/getCursorThemes.js';

const DESKTOP_SCHEMA = 'org.gnome.desktop.interface';

const dconfDesktopSettings = new Gio.Settings({schema_id: DESKTOP_SCHEMA});

const cursorThemesMenu = async () => {
    const menu = new PopupMenu.PopupSubMenuMenuItem('Cursor Themes', false);

    const scrollView = new St.ScrollView();
    const section = new PopupMenu.PopupMenuSection();

    if (GNOME_SHELL_VERSION === 45)
        scrollView.add_actor(section.actor);
    else
        scrollView.add_child(section.actor);

    menu.menu.box.add_child(scrollView);

    const items = [];

    const cursorThemes = await getCursorThemes();

    cursorThemes.forEach(cursorThemeName => {
        const cursorThemeNameItem = new PopupMenu.PopupMenuItem(cursorThemeName);
        items.push(cursorThemeNameItem);

        section.addMenuItem(cursorThemeNameItem);

        cursorThemeNameItem.connect('key-focus-in', () => {
            AnimationUtils.ensureActorVisibleInScrollView(scrollView, cursorThemeNameItem);
        });

        cursorThemeNameItem.connect('activate', () => {
            dconfDesktopSettings.set_string('cursor-theme', cursorThemeName);
            updateOrnament(items, cursorThemeName);
        });
    });

    const text = dconfDesktopSettings.get_string('cursor-theme');
    updateOrnament(items, text);

    return menu;
};

export default cursorThemesMenu;
