import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'SEWA USA',
  projectId: 'oy6psniq',
  dataset: 'production',
  plugins: [structureTool()],
  schema: {types: schemaTypes},
})
