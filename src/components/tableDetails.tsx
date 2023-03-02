export type Column = {
    header: string;
    id: string;
    menu: string;
    content: string;
}

export const tableColumns: Column[] = [
    {
        header: "Name",
        id: "name",
        menu: "Basic Information",
        content: "content"
    },
    {
        header: "Diameter",
        id: "diameter",
        menu: "Basic Information",
        content: "content"
    },
    {
        header: "Colour",
        id: "colour",
        menu: "Style information",
        content: "content"
    },
    {
        header: "Abstract?",
        id: "abstract",
        menu: "Miscellaneous",
        content: "content"
    }
]