export type RecordType = 'text' | 'file' | 'folder' | 'diverse'

export default interface Record {
	id: string
	date: string
	type: RecordType
	content: string
}
