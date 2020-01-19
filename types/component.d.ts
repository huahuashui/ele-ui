import {Vue} from "vue-property-decorator";

/** SnUI component common definition */
export interface SnUIComponent extends Vue {
    install?(): void;
}

/** Component size definition for button, input, etc */
export type SnUIComponentSize = 'large' | 'medium' | 'small' | 'tiny' | 'mini';

/** Horizontal alignment */
export type SnUIHorizontalAlignment = 'left' | 'center' | 'right';
