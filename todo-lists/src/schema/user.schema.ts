import S from 'fluent-json-schema'

export const listCreateSchema = {
    body: S.object()
        .prop('id', S.string().required())
        .prop('description', S.string().required()),
    queryString: S.object(),
    params: S.object(),
    headers: S.object()
}