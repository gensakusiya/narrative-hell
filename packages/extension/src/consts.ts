export const START_BEAT = 'start';
export const END_BEAT = 'END';

export const beatRegex = /^<<<\s+(\w+)\s+>>>/;
export const transitionRegex = /^\*\s*\[/; // begin of transition: *[
export const gotoRegex = /->\s+(\w+)/;
export const effectRegex = /^\s*~/; // effect: ~
export const metadataRegex = /^\s*@/; // metadata: @
export const commentRegex = /^\s*\/\*/; // comments: /*

export const EFFECT_SYMBOL = '~';
export const TRANSITION_SYMBOL = '*';
export const GOTO_SYMBOL = '->';
export const METADATA_SYMBOL = '@';
export const COMMENT_START_SYMBOL = '/*';
export const COMMENT_END_SYMBOL = '/*';
