import {defineField, defineType} from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: "Membre de l'équipe",
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Nom complet', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'role', title: 'Rôle', description: 'Ex. : Président(e), Trésorier(ère)', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'bio', title: 'Présentation courte', type: 'text', rows: 4, validation: (r) => r.max(400)}),
    defineField({name: 'photo', title: 'Photo', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'sample',
      title: "Contenu d'exemple",
      description: "Cochez pour afficher l'étiquette « Exemple » sur le site. Décochez (ou supprimez) quand c'est du vrai contenu.",
      type: 'boolean',
      initialValue: false,
    }),
    defineField({name: 'order', title: "Ordre d'affichage", description: '1 = en premier', type: 'number', initialValue: 10}),
  ],
  orderings: [{title: 'Ordre', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
})
