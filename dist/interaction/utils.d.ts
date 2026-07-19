import { type Entity } from "../types/output.js";
import { type InteractionContent, type InteractionRecord } from "../types/interactions.js";
export declare function sanitizeInteraction(data: string, entity: Entity): InteractionContent;
export declare function createInteractionRecord(): InteractionRecord;
export declare function sanitizeAndPrintInteraction(interaction: InteractionRecord): void;
export declare function parsePrevModelResponseId(interactionHistory: InteractionRecord): string | undefined;
//# sourceMappingURL=utils.d.ts.map