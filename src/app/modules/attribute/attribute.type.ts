export default interface AttributeType {
    title: object;
    name: object;
    option: "Dropdown" | "Radio" | "Checkbox";
    variants: Array<Variant>;
    type: "TextColor" | "Image" | "Button";
    status: "show" | "hide";
    created_at?: Date;
    updated_at?: Date;
}

interface Variant {
    name: string;
    status: ["show", "hide"];
}
