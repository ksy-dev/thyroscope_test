export const tableData = [
    {
        username: 'John',
        email: 'john@thyroscope.com',
        nickname: 'moderator',
        gender: 'male',
        isChecked: false,
        isError: false,
    },
    {
        username: 'Frank',
        email: 'frank@thyroscope.com',
        nickname: 'mafia1',
        gender: 'male',
        isChecked: false,
        isError: false,
    },
    {
        username: 'Julie',
        email: 'julie@thyroscope.com',
        nickname: 'civilian2',
        gender: 'female',
        isChecked: false,
        isError: false,
    },
    {
        username: 'Steve',
        email: 'steve@thyroscope.com',
        nickname: 'civilian1',
        gender: 'male',
        isChecked: false,
        isError: false,
    },
]

export const columnData = [
    {
        accessor: 'isError',
        Header: '',
    },
    {
        accessor: 'isChecked',
        Header: '',
    },
    {
        accessor: 'username',
        Header: 'username',
        width: 200
    },
    {
        accessor: 'email',
        Header: 'email',
        disableGlobalFilter: true,
        width: 200
    },
    {
        accessor: 'nickname',
        Header: 'nickname',
        disableGlobalFilter: true,
        width: 200
    },
    {
        accessor: 'gender',
        Header: 'gender',
        disableGlobalFilter: true,
        width: 200
    },
]