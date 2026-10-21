export type ModuleRow = {
  id: number; slug: string; name: string; description: string; icon: string; theme: string; sort_order: number;
};
export type LevelRow = {
  id: number; module_id: number; slug: string; name: string; description: string; sort_order: number;
  required_xp: number; xp_reward: number;
};
export type ContentRow = {
  id: number; level_id: number; title: string; body: string; code_example: string | null; visual_type: string | null; sort_order: number;
};
export type ActivityOption = { id: number; activity_id: number; option_text: string; sort_order: number };
export type Activity = {
  id: number; level_id: number; question: string; feedback_correct: string; feedback_incorrect: string; xp_reward: number;
  activity_options: ActivityOption[];
};
export type Challenge = {
  id: number; level_id: number; title: string; statement: string; starter_code: string; expected_output: string; xp_reward: number;
};
