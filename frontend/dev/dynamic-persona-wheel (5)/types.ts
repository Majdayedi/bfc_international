
export interface Persona {
  id: number;
  name: string;
  role: string;
  bio: string;
  quote: string;
  imageUrl: string;
  color: string;
}

export interface WheelConfig {
  radius: number;
  itemSize: number;
  rotationOffset: number;
}
