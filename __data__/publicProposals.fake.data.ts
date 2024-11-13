import { Gender } from '@match-app/shared';
import { PublicProposal } from '@match-app/shared/dist/model/ProposalDelivery';

const publicProposalsFakeData: PublicProposal[] = [
  {
    id: '1',
    profile: {
      id: 'user_1',
      pictures: [
        {
          isBlurred: false,
          url: 'https://images.unsplash.com/photo-1500336624523-d727130c3328?ixlib=rb-1.2.1&auto=format&fit=crop&w=2734&q=80',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1500336624523-d727130c3328?ixlib=rb-1.2.1&auto=format&fit=crop&w=2734&q=80',
        },
      ],
      name: 'Annabelle-Josephine',
      distance: '3 km',
      age: '26',
      description:
        'Du möchtest mich kennenlernen, sag mir was du kannst und was du willst.',
      gender: Gender.FEMALE,
      relationshipStatus: 'single',
      height: '180 cm',
      place: 'Mitte',
      preferredPlaces: ['Berlin', 'Mitte'],
    },
  },
  {
    id: '2',
    profile: {
      id: 'user_2',
      pictures: [
        {
          isBlurred: false,
          url: 'https://images.unsplash.com/photo-1537111511-531adc93c246?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80\n',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1537111511-531adc93c246?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80\n',
        },
      ],
      name: 'Amelia',
      distance: '3 km',
      age: '23',
      description: '🙀',
      gender: Gender.FEMALE,
      relationshipStatus: 'single',
      height: '180 cm',
      place: '',
      preferredPlaces: [''],
    },
  },
  {
    id: '3',
    profile: {
      id: 'user_3',
      pictures: [
        {
          isBlurred: false,
          url: 'https://images.unsplash.com/photo-1525828024186-5294af6c926d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1525828024186-5294af6c926d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=934&q=80',
        },
      ],
      name: 'Hanna',
      distance: '100 km',
      age: '100',
      description: 'Du möchtest mich kennenlernen?',
      gender: Gender.FEMALE,
      relationshipStatus: 'single',
      height: '170 cm',
      place: 'Mitte',
      preferredPlaces: ['Hotel'],
    },
  },
  {
    id: '4',
    profile: {
      id: 'user_4',
      pictures: [
        {
          isBlurred: false,
          url: 'https://images.unsplash.com/photo-1514315384763-ba401779410f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=930&q=80',
          thumbnailUrl:
            'https://images.unsplash.com/photo-1514315384763-ba401779410f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=930&q=80',
        },
      ],
      name: 'Kendal',
      distance: '10 km',
      age: '26',
      description:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
      gender: Gender.FEMALE,
      relationshipStatus: 'single',
      height: '160 cm',
      place: 'Mitte',
      preferredPlaces: ['Berlin'],
    },
  },
];

export default publicProposalsFakeData;
