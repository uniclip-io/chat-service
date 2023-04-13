export type ClipboardType = 'text' | 'file' | 'folder' | 'diverse'

export type Record = {
	id: string
	date: string
	type: ClipboardType
	content: string
}
