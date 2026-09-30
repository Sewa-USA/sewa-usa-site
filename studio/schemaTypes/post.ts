import {defineField, defineType} from 'sanity'

export const post = defineType({
  name: 'post',
  title: 'Article',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Titre', type: 'string', validation: (r) => r.required().max(140)}),
    defineField({
      name: 'slug',
      title: 'Adresse de la page',
      description: 'Cliquez sur « Generate » : elle se crée à partir du titre.',
      type: 'slug',
      options: {source: 'title', maxLength: 80},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {list: ['Actualité', 'Communiqué officiel'], layout: 'radio'},
      initialValue: 'Actualité',
      validation: (r) => r.required(),
    }),
    defineField({name: 'date', title: 'Date de publication', type: 'datetime', initialValue: () => new Date().toISOString(), validation: (r) => r.required()}),
    defineField({name: 'summary', title: 'Résumé (2 phrases)', type: 'text', rows: 3, validation: (r) => r.required().max(300)}),
    defineField({name: 'body', title: 'Texte', description: 'Une ligne vide entre deux paragraphes.', type: 'text', rows: 14, validation: (r) => r.required()}),
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
  preview: {select: {title: 'title', subtitle: 'category', media: 'image'}},
})
