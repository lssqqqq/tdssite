import { CustomDocTemplate } from '../types/customDoc';
import { Language } from '../i18n/translations';
import {
  MONOCHROME_BANNER_PLACEHOLDER,
  MONOCHROME_AVATAR_PLACEHOLDER
} from './tdsPhotoAssets';

export const getInitialCustomDoc = (_lang?: Language): CustomDocTemplate => {
  return {
    // Canvas format and page layout defaults
    canvasSettings: {
      format: 'a4',
      orientation: 'portrait',
      margins: 'normal',
      theme: 'black',
      zoom: 1,
      layoutMode: 'multi-page',
      showGrid: false,
      showPageNumbers: true
    },

    // ================= TAB 1 =================
    tab1: {
      bannerImage: MONOCHROME_BANNER_PLACEHOLDER,
      subBannerText: 'write here...',
      categories: [
        {
          id: 'creators',
          title: 'CREATORS',
          members: [
            { id: 'c1', name: 'Name', image: MONOCHROME_AVATAR_PLACEHOLDER },
            { id: 'c2', name: 'Name', image: MONOCHROME_AVATAR_PLACEHOLDER },
            { id: 'c3', name: 'Name', image: MONOCHROME_AVATAR_PLACEHOLDER },
            { id: 'c4', name: 'Name', image: MONOCHROME_AVATAR_PLACEHOLDER }
          ]
        },
        {
          id: 'mapMaker',
          title: 'PLACEMENT MAP MAKER',
          members: [
            { id: 'mm1', name: 'Name', image: MONOCHROME_AVATAR_PLACEHOLDER }
          ]
        },
        {
          id: 'testers',
          title: 'TESTERS',
          members: [
            { id: 't1', name: 'Name', image: MONOCHROME_AVATAR_PLACEHOLDER },
            { id: 't2', name: 'Name', image: MONOCHROME_AVATAR_PLACEHOLDER },
            { id: 't3', name: 'Name', image: MONOCHROME_AVATAR_PLACEHOLDER }
          ]
        }
      ],
      notesTitle: 'NOTES',
      notesRows: [
        { id: 'nr1', label: '', content: '' },
        { id: 'nr2', label: '', content: '' },
        { id: 'nr3', label: '', content: '' },
        { id: 'nr4', label: '', content: '' }
      ],
      extraSections: []
    },

    // ================= TAB 2 =================
    tab2: {
      topNotesTitle: 'NOTES',
      topNotesRows: [
        { id: 'tn1', label: '', content: '' },
        { id: 'tn2', label: '', content: '' }
      ],
      loadoutsTitle: 'LOADOUTS',
      loadoutRows: [
        {
          id: 'lr1',
          playerTitle: 'Player 1',
          slots: [
            { id: 's1', name: '', image: '' },
            { id: 's2', name: '', image: '' },
            { id: 's3', name: '', image: '' },
            { id: 's4', name: '', image: '' },
            { id: 's5', name: '', image: '' }
          ]
        },
        {
          id: 'lr2',
          playerTitle: 'Player 2',
          slots: [
            { id: 's6', name: '', image: '' },
            { id: 's7', name: '', image: '' },
            { id: 's8', name: '', image: '' },
            { id: 's9', name: '', image: '' },
            { id: 's10', name: '', image: '' }
          ]
        }
      ],
      strategyTitle: 'STRATEGY',
      players: [
        {
          id: 'p1',
          playerTitle: 'PLAYER 1',
          difficultyBadge: 'Difficulty: Normal',
          towers: [
            { id: 'pt1', name: '', image: '' },
            { id: 'pt2', name: '', image: '' },
            { id: 'pt3', name: '', image: '' },
            { id: 'pt4', name: '', image: '' },
            { id: 'pt5', name: '', image: '' }
          ],
          mapPhoto: '',
          tokens: [],
          notes: '',
          waveRows: [
            { wave: '', instructions: '' },
            { wave: '', instructions: '' },
            { wave: '', instructions: '' }
          ]
        },
        {
          id: 'p2',
          playerTitle: 'PLAYER 2',
          difficultyBadge: 'Difficulty: Hard',
          towers: [
            { id: 'pt6', name: '', image: '' },
            { id: 'pt7', name: '', image: '' },
            { id: 'pt8', name: '', image: '' },
            { id: 'pt9', name: '', image: '' },
            { id: 'pt10', name: '', image: '' }
          ],
          mapPhoto: '',
          tokens: [],
          notes: '',
          waveRows: [
            { wave: '', instructions: '' },
            { wave: '', instructions: '' }
          ]
        }
      ],
      commonIssuesTitle: 'COMMON ISSUES',
      commonIssuesRows: [
        { id: 'ci1', wave: '', reason: '' },
        { id: 'ci2', wave: '', reason: '' }
      ]
    }
  };
};

export const INITIAL_CUSTOM_DOC: CustomDocTemplate = getInitialCustomDoc('en');
