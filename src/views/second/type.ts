export interface GuideStep {
    element: string | HTMLElement;
    title: string;
    intro: string;
    position: "left" | "right" | "top" | "bottom";
}