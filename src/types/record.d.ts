export type RecordType = 'text' | 'file' | 'folder' | 'diverse'

export default interface Record {
	userId: string
	id: string
	date: string
	type: RecordType
	content: string
}
