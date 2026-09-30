import {defineField, defineType} from 'sanity'

export const resource = defineType({
  name: 'resource',
  title: 'Ressource',
  type: 'document',
  fields: [
    defineField({
      name: 'category',
      title: 'Catégorie',
      type: 'string',
      options: {list: ['Immigration et droit', 'Logement', 'Emploi', 'Santé', 'Éducation', 'Vie associative', 'Autre']},
      validation: (r) => r.required(),
    }),
    defineField({name: 'title', title: 'Titre', type: 'string', validation: (r) => r.required().max(100)}),
    defineField({name: 'description', title: 'Description (1 à 2 phrases)', type: 'text', rows: 3, validation: (r) => r.required().max(250)}),
    defineField({name: 'url', title: 'Lien', type: 'url', validation: (r) => r.required().uri({scheme: ['https']})}),
  ],
  preview: {select: {title: 'title', subtitle: 'category'}},
})
