export type RecordType = 'text' | 'file' | 'folder' | 'diverse'

export default interface Record {
	userid: string // not `userId` because of message parsing
	id: string
	date: string
	type: RecordType
	content: string
}
