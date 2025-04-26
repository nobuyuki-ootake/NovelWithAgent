export interface WorldBuilding {
  places: Place[];
  timelineSettings?: {
    startDate: string;
  };
}

export interface Place {
  id: string;
  name: string;
  description?: string;
}

export interface Character {
  id: string;
  name: string;
  role: "protagonist" | "antagonist" | "supporting";
  imageUrl?: string;
  gender?: string;
  birthDate?: string;
  description?: string;
  background?: string;
  motivation?: string;
  traits?: CharacterTrait[];
  relationships?: Relationship[];
  customFields?: CustomField[];
}

export interface Relationship {
  id: string;
  targetCharacterId: string;
  type: string;
  description?: string;
}

export interface CharacterTrait {
  id: string;
  name: string;
  value: string;
}

export interface CustomField {
  id: string;
  name: string;
  value: string;
}
