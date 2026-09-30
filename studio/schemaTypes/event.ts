import {defineField, defineType} from 'sanity'

export const event = defineType({
  name: 'event',
  title: 'Événement',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string', validation: (r) => r.required().max(120)}),
    defineField({
      name: 'slug',
      title: 'Adresse de la page',
      description: 'Cliquez sur « Generate » : elle se crée à partir du titre.',
      type: 'slug',
      options: {source: 'title', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date et heure',
      description: "L'événement passe tout seul dans « Événements passés » après cette date.",
      type: 'datetime',
      validation: (r) => r.required(),
    }),
    defineField({name: 'location', title: 'Lieu', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'summary', title: 'Résumé (2 phrases)', type: 'text', rows: 3, validation: (r) => r.required().max(300)}),
    defineField({name: 'body', title: 'Détails', description: 'Une ligne vide entre deux paragraphes.', type: 'text', rows: 8}),
    defineField({
      name: 'sample',
      title: "Contenu d'exemple",
      description: "Cochez pour afficher l'étiquette « Exemple » sur le site. Décochez (ou supprimez) quand c'est du vrai contenu.",
      type: 'boolean',
      initialValue: false,
    }),
    defineField({name: 'image', title: 'Photo', type: 'image', options: {hotspot: true}}),
  ],
  orderings: [{title: 'Date (récent en premier)', name: 'dateDesc', by: [{field: 'date', direction: 'desc'}]}],
  preview: {select: {title: 'title', subtitle: 'date', media: 'image'}},
})
