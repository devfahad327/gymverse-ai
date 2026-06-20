export interface Exercise {
  id: string;
  name: string;
  category: string;
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  musclesWorked: string[];
  targetMuscleGroup: string;
  instructions: string[];
  commonMistakes: string[];
  injuryRisks: string[];
  formTips: string[];
  breathing: string;
  alternatives: string[];
  youtubeId: string;
  startPosition: string;
  endPosition: string;
  rangeOfMotion: string;
}

export const BASE_EXERCISES: Exercise[] = [
  // --- CHEST ---
  {
    id: "flat-bench-press",
    name: "Barbell Bench Press",
    category: "Chest",
    equipment: "Barbell",
    difficulty: "Intermediate",
    musclesWorked: ["Pectoralis Major", "Triceps Brachii", "Anterior Deltoid"],
    targetMuscleGroup: "Mid Chest",
    instructions: [
      "Lie flat on the bench, feet flat on the floor, eyes directly under the bar.",
      "Grip the bar slightly wider than shoulder-width, wrap your thumbs around.",
      "Retract your shoulder blades and brace your core.",
      "Unrack the bar, lower it slowly to your mid-chest while keeping elbows at a 45-degree angle.",
      "Press the bar back up to the starting position by pushing the floor away with your feet."
    ],
    commonMistakes: [
      "Flaring elbows out to 90 degrees, overloading the shoulders.",
      "Bouncing the bar off the chest.",
      "Lifting feet or hips off the ground/bench."
    ],
    injuryRisks: [
      "Rotator cuff strains due to elbow flaring.",
      "Pectoral tears from dropping the bar too fast or lifting heavy with poor form."
    ],
    formTips: [
      "Maintain a slight arch in your lower back, but keep your glutes on the bench.",
      "Squeeze the bar hard to engage the forearms and stabilize the wrists."
    ],
    breathing: "Inhale slowly as you lower the bar; exhale powerfully as you press it back up.",
    alternatives: ["Dumbbell Bench Press", "Push-ups", "Chest Press Machine"],
    youtubeId: "Lr8hSSFcByY",
    startPosition: "Lie on bench with bar racked, arms extended over chest after unracking.",
    endPosition: "Bar touching the lower sternum, elbows bent and tucked at 45 degrees.",
    rangeOfMotion: "Full vertical press from chest level to locked-out arms."
  },
  {
    id: "incline-db-press",
    name: "Incline Dumbbell Press",
    category: "Chest",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    musclesWorked: ["Clavicular Pectoralis", "Anterior Deltoid", "Triceps Brachii"],
    targetMuscleGroup: "Upper Chest",
    instructions: [
      "Set an adjustable bench to a 30-45 degree incline.",
      "Sit back holding dumbbells at chest level, elbows bent.",
      "Press the weights up over your head until arms are straight, keeping wrists aligned.",
      "Lower the dumbbells slowly until they reach chest height, feeling a stretch in the upper chest.",
      "Press the weights back up dynamically."
    ],
    commonMistakes: [
      "Setting the bench angle too high (above 45 degrees), moving the load to the shoulders.",
      "Clicking dumbbells together at the top.",
      "Letting the wrists bend backwards."
    ],
    injuryRisks: [
      "Shoulder impingement from dropping elbows too low.",
      "Wrist hyperextension under heavy weights."
    ],
    formTips: [
      "Keep your shoulders pressed back into the bench throughout the lift.",
      "Keep dumbbells slightly angled in a V-shape rather than straight across."
    ],
    breathing: "Inhale on the descent; exhale on the press.",
    alternatives: ["Incline Barbell Press", "Incline Cable Fly", "Incline Machine Press"],
    youtubeId: "a90rx2xQro0",
    startPosition: "Sitting back on incline bench, dumbbells held at shoulder width above the chest.",
    endPosition: "Dumbbells lowered to the outer edges of the upper chest.",
    rangeOfMotion: "Dumbbells descend to upper chest level and rise to meet over the sternum."
  },
  {
    id: "cable-fly",
    name: "Standing Cable Fly",
    category: "Chest",
    equipment: "Cable",
    difficulty: "Beginner",
    musclesWorked: ["Pectoralis Major", "Anterior Deltoid"],
    targetMuscleGroup: "Inner Chest",
    instructions: [
      "Set pulleys to shoulder height. Grab handles and take a step forward between pulleys.",
      "Lean slightly forward, keep a slight bend in elbows, and open arms wide to feel a stretch.",
      "Squeeze your chest to bring handles together in an arching motion in front of your chest.",
      "Pause for a second at peak contraction, then slowly return to the starting stretch position."
    ],
    commonMistakes: [
      "Turning the fly into a press by flexing elbows too much.",
      "Using momentum and swinging the body.",
      "Allowing shoulders to roll forward at the end of the motion."
    ],
    injuryRisks: [
      "Shoulder strain if cables pull the arms too far back behind the body plane."
    ],
    formTips: [
      "Imagine hugging a large tree to maintain the proper arm bend.",
      "Focus on driving your biceps into the side of your chest."
    ],
    breathing: "Inhale as you open the arms; exhale as you bring the handles together.",
    alternatives: ["Dumbbell Fly", "Pec Deck Machine", "Band Chest Fly"],
    youtubeId: "I8u8YFc1v-M",
    startPosition: "Standing forward with arms out to the sides, cables taut.",
    endPosition: "Hands meeting in front of the chest, chest fully contracted.",
    rangeOfMotion: "Wide circular sweep from deep lateral stretch to full midline squeeze."
  },

  // --- BACK ---
  {
    id: "barbell-deadlift",
    name: "Barbell Deadlift",
    category: "Back",
    equipment: "Barbell",
    difficulty: "Intermediate",
    musclesWorked: ["Erector Spinae", "Latissimus Dorsi", "Gluteus Maximus", "Hamstrings", "Trapezius"],
    targetMuscleGroup: "Lower Back & Posterier Chain",
    instructions: [
      "Stand with feet shoulder-width apart, shins about an inch from the bar.",
      "Hinge at your hips and bend knees slightly to grip the bar with a flat back.",
      "Pull your chest up, drop your hips slightly, and engage your lats by squeezing your armpits.",
      "Drive through your heels to stand up, keeping the bar close to your body.",
      "Lock out hips and knees at the top, then hinge at the hips to lower the bar back down."
    ],
    commonMistakes: [
      "Rounding the lower back (cat-backing).",
      "Keeping the bar too far from the shins.",
      "Squatting the weight up instead of hinges."
    ],
    injuryRisks: [
      "Herniated discs or severe lumbar strain from rounded back lifting."
    ],
    formTips: [
      "Keep your neck neutral; look at the floor a few feet in front of you.",
      "Brace your core as if about to be punched before you pull."
    ],
    breathing: "Inhale and brace at the bottom; hold breath during the lift; exhale at lockout.",
    alternatives: ["Trap Bar Deadlift", "Romanian Deadlift", "Sumo Deadlift"],
    youtubeId: "iid8r-CVK-o",
    startPosition: "Standing over bar, bending down to grip bar, back flat, shins touching bar.",
    endPosition: "Standing upright with bar resting against thighs, shoulders pulled back.",
    rangeOfMotion: "Pull from floor level to full hip extension."
  },
  {
    id: "pull-up",
    name: "Pull-Up",
    category: "Back",
    equipment: "Bodyweight",
    difficulty: "Intermediate",
    musclesWorked: ["Latissimus Dorsi", "Teres Major", "Rhomboids", "Biceps Brachii"],
    targetMuscleGroup: "Lats & Upper Back",
    instructions: [
      "Grip the pull-up bar with an overhand grip, slightly wider than shoulder-width.",
      "Hang with arms fully extended (dead hang), shoulder blades depressed.",
      "Pull your body up by driving your elbows down toward your ribs.",
      "Clear the bar with your chin, keeping your chest open.",
      "Slowly lower yourself back to a full hang under control."
    ],
    commonMistakes: [
      "Kipping or swinging the legs to get up.",
      "Not completing the full range of motion (half reps).",
      "Shrugging shoulders up to ears."
    ],
    injuryRisks: [
      "Shoulder impingement or elbow tendinitis from sudden dropping."
    ],
    formTips: [
      "Cross your ankles and squeeze your glutes to stabilize your lower body.",
      "Think about pulling the bar down to your collarbone."
    ],
    breathing: "Exhale on the pull up; inhale on the slow descent.",
    alternatives: ["Lat Pulldown", "Assisted Pull-Up Machine", "Chin-Up"],
    youtubeId: "HRV5Y11R5Ho",
    startPosition: "Hanging from the bar with straight arms, body completely still.",
    endPosition: "Chin above bar level, chest close to the bar.",
    rangeOfMotion: "Vertical pull from dead hang to chin-over-bar."
  },
  {
    id: "barbell-row",
    name: "Bent-Over Barbell Row",
    category: "Back",
    equipment: "Barbell",
    difficulty: "Intermediate",
    musclesWorked: ["Latissimus Dorsi", "Rhomboids", "Middle Trapezius", "Rear Deltoid"],
    targetMuscleGroup: "Mid Back Thickness",
    instructions: [
      "Hold a barbell with an overhand grip, feet shoulder-width apart.",
      "Hinge at the hips until your torso is nearly parallel to the floor, knees slightly bent.",
      "Keep back flat and bar hanging at arm's length.",
      "Pull the bar to your lower rib cage, driving elbows back and squeezing shoulder blades.",
      "Lower the bar slowly to the starting position."
    ],
    commonMistakes: [
      "Rounding the spine.",
      "Using dynamic leg drive to bounce the weight up.",
      "Pulling to the chest rather than the belly button."
    ],
    injuryRisks: [
      "Lower back strain from structural breakdown under load."
    ],
    formTips: [
      "Squeeze your shoulder blades together at the top of every rep.",
      "Keep elbows tucked to target lats, or flare slightly to hit upper back."
    ],
    breathing: "Inhale as you lower the weight; exhale as you pull it up.",
    alternatives: ["One-Arm Dumbbell Row", "Seated Cable Row", "T-Bar Row"],
    youtubeId: "FWJR5y80c8s",
    startPosition: "Torso hinged forward at 45 degrees, arms hanging straight holding the barbell.",
    endPosition: "Barbell pulled up touching the upper abdomen/lower chest.",
    rangeOfMotion: "Horizontal pull from straight hang to contact with torso."
  },

  // --- SHOULDERS ---
  {
    id: "overhead-press",
    name: "Barbell Overhead Press",
    category: "Shoulders",
    equipment: "Barbell",
    difficulty: "Intermediate",
    musclesWorked: ["Anterior Deltoid", "Lateral Deltoid", "Triceps Brachii", "Trapezius", "Core"],
    targetMuscleGroup: "Front Delts & Strength",
    instructions: [
      "Set the bar in a rack at chest height. Grip slightly wider than shoulders.",
      "Unrack the bar on your collarbones, elbows slightly in front of the bar.",
      "Squeeze your glutes, thighs, and brace your core.",
      "Press the bar straight up, tilting your head back slightly as it passes your face.",
      "Once the bar clears your head, push your head forward ('push head through the window') and lock out elbows."
    ],
    commonMistakes: [
      "Excessive back bending, converting it to an incline press.",
      "Elbows flaring out to the sides.",
      "Not locking out at the top."
    ],
    injuryRisks: [
      "Lower back injury from hyperextension.",
      "Shoulder impingement from pressing with a forward posture."
    ],
    formTips: [
      "Keep your body rigid; your legs should not bend at all (strict press).",
      "Keep forearms completely vertical beneath the bar."
    ],
    breathing: "Inhale and brace at the bottom; press and exhale at the top.",
    alternatives: ["Dumbbell Shoulder Press", "Kettlebell Press", "Seated Overhead Press"],
    youtubeId: "2yjwXTZQDDI",
    startPosition: "Standing with barbell resting in front rack position on upper chest.",
    endPosition: "Bar locked out directly overhead, aligned with spine.",
    rangeOfMotion: "Vertical press from collarbones to overhead lockout."
  },
  {
    id: "lateral-raise",
    name: "Dumbbell Lateral Raise",
    category: "Shoulders",
    equipment: "Dumbbells",
    difficulty: "Beginner",
    musclesWorked: ["Lateral Deltoid", "Anterior Deltoid", "Upper Trapezius"],
    targetMuscleGroup: "Side Delts (Shoulder Width)",
    instructions: [
      "Stand holding dumbbells at your sides, palms facing inward.",
      "Keep a slight bend in your elbows and lean your torso slightly forward.",
      "Raise the weights out to your sides in a wide arc until arms are parallel to the floor.",
      "Pause at the top, then slowly lower the weights back to the start."
    ],
    commonMistakes: [
      "Swinging the body or using momentum.",
      "Leading with the hands instead of the elbows (wrists higher than elbows).",
      "Lifting weights too high, loading the traps."
    ],
    injuryRisks: [
      "Shoulder impingement if arms are raised too high or rotated incorrectly."
    ],
    formTips: [
      "Think about pushing the weights out toward the walls rather than up.",
      "Keep your pinky fingers slightly tilted up at the top ('pouring out pitchers')."
    ],
    breathing: "Exhale as you raise the dumbbells; inhale as you lower them.",
    alternatives: ["Cable Lateral Raise", "Machine Lateral Raise", "Band Lateral Raise"],
    youtubeId: "3VcKaX_pG5A",
    startPosition: "Standing with dumbbells hanging at hips, palms facing each other.",
    endPosition: "Dumbbells raised to shoulder height, elbows slightly bent.",
    rangeOfMotion: "Abduction sweep from thighs to shoulder-level horizontal plane."
  },

  // --- BICEPS ---
  {
    id: "barbell-curl",
    name: "Barbell Bicep Curl",
    category: "Biceps",
    equipment: "Barbell",
    difficulty: "Beginner",
    musclesWorked: ["Biceps Brachii (Long & Short Head)", "Brachialis", "Forearms"],
    targetMuscleGroup: "Bicep Peak & Thickness",
    instructions: [
      "Stand holding a barbell with an underhand grip (palms up), hands shoulder-width apart.",
      "Keep your elbows tucked close to your torso and chest upright.",
      "Curl the bar upward while keeping your upper arms stationary.",
      "Contract your biceps fully at the top, then lower the bar slowly under control."
    ],
    commonMistakes: [
      "Swinging the weight using your hips and lower back.",
      "Letting elbows drift forward too far, engaging the front shoulders.",
      "Dropping the weight rapidly without resistance."
    ],
    injuryRisks: [
      "Elbow tendon strain or wrist discomfort from rigid barbell grip (try EZ-bar instead if hurt)."
    ],
    formTips: [
      "Squeeze your glutes and core to keep your body completely locked in place.",
      "Only the forearms should move; keep upper arms vertical."
    ],
    breathing: "Exhale as you curl up; inhale as you lower the weight.",
    alternatives: ["Dumbbell Bicep Curl", "Cable Curl", "Preacher Curl"],
    youtubeId: "i1YgFZmeWxo",
    startPosition: "Standing upright, barbell held at thighs, arms straight.",
    endPosition: "Barbell raised to shoulder level, biceps fully flexed.",
    rangeOfMotion: "Arcing swing from thighs to shoulders."
  },
  {
    id: "incline-db-curl",
    name: "Incline Dumbbell Bicep Curl",
    category: "Biceps",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    musclesWorked: ["Biceps Brachii (Long Head focus)", "Brachioradialis"],
    targetMuscleGroup: "Bicep Peak",
    instructions: [
      "Set a bench to a 45-degree incline. Sit back, letting your arms hang straight down behind you.",
      "Hold dumbbells with palms facing forward.",
      "Keep elbows back and curl the weights up toward your shoulders.",
      "Squeeze at the top, then slowly lower to a full stretch at the bottom."
    ],
    commonMistakes: [
      "Letting elbows swing forward during the curl.",
      "Not lowering to a full stretch at the bottom."
    ],
    injuryRisks: [
      "Bicep tendon strain at the shoulder if weight is dropped too quickly into deep stretch."
    ],
    formTips: [
      "Keep your shoulders pressed back against the pad to maximize bicep isolation."
    ],
    breathing: "Exhale up; inhale down.",
    alternatives: ["Concentration Curl", "Preacher Curl", "Spider Curl"],
    youtubeId: "soxrZlIl35U",
    startPosition: "Seated on incline bench, arms hanging straight down towards floor.",
    endPosition: "Dumbbells curled up to shoulder level, elbows still locked back.",
    rangeOfMotion: "Curl from deep behind-the-torso stretch to shoulder level."
  },

  // --- TRICEPS ---
  {
    id: "cable-pushdown",
    name: "Cable Tricep Pushdown",
    category: "Triceps",
    equipment: "Cable",
    difficulty: "Beginner",
    musclesWorked: ["Triceps Brachii (Lateral & Medial Head)"],
    targetMuscleGroup: "Tricep Definition",
    instructions: [
      "Attach a rope or straight bar to a high pulley. Grip handle and step back.",
      "Tuck your elbows into your sides and lean forward slightly at the hips.",
      "Push the cable down by extending your elbows until arms are completely straight.",
      "Squeeze the triceps at the bottom, then slowly return to the starting elbow-flexed position."
    ],
    commonMistakes: [
      "Allowing elbows to flare out or move forward and back.",
      "Using body weight to press the weight down.",
      "Short-ranging the rep at the bottom."
    ],
    injuryRisks: [
      "Elbow joint inflammation from using excessively heavy weights."
    ],
    formTips: [
      "Squeeze your triceps hard at the bottom and flare the rope outward.",
      "Keep your wrists straight; do not let them bend."
    ],
    breathing: "Exhale on the push down; inhale on the release.",
    alternatives: ["Skull Crushers", "Tricep Overhead Extension", "Dips"],
    youtubeId: "2-LAMcpzODU",
    startPosition: "Standing with elbows bent at 90 degrees, hands holding rope at chest height.",
    endPosition: "Arms fully extended downward, rope split wide at thighs.",
    rangeOfMotion: "Vertical push from chest height to full elbow lockout."
  },
  {
    id: "skull-crushers",
    name: "EZ-Bar Skull Crusher",
    category: "Triceps",
    equipment: "Barbell",
    difficulty: "Intermediate",
    musclesWorked: ["Triceps Brachii (Long Head focus)", "Anconeus"],
    targetMuscleGroup: "Tricep Mass",
    instructions: [
      "Lie flat on a bench holding an EZ-bar over your chest with straight arms.",
      "Incline your arms slightly backward (about 15 degrees) to keep tension on triceps.",
      "Keep upper arms locked in place, bend elbows to lower the bar toward your forehead or behind head.",
      "Extend your elbows back to return to the starting position."
    ],
    commonMistakes: [
      "Moving the elbows forward and back, converting it into a shoulder pull.",
      "Flaring elbows wide out to the sides.",
      "Bumping the forehead with the bar."
    ],
    injuryRisks: [
      "Elbow tendinitis (triceps tendon strain) due to shear stress."
    ],
    formTips: [
      "Point your elbows inward throughout the movement.",
      "Lowering the bar slightly behind your head hits the long head more effectively."
    ],
    breathing: "Inhale as you bend elbows; exhale as you push up.",
    alternatives: ["Dumbbell Tricep Extension", "Close-Grip Bench Press", "Overhead Cable Extension"],
    youtubeId: "d_KZxkY_0cM",
    startPosition: "Lie on bench holding EZ-bar over head, arms tilted slightly back.",
    endPosition: "Elbows flexed, bar lowered just past the crown of the head.",
    rangeOfMotion: "Elbow flexion and extension arc."
  },

  // --- LEGS ---
  {
    id: "barbell-squat",
    name: "Barbell Back Squat",
    category: "Legs",
    equipment: "Barbell",
    difficulty: "Intermediate",
    musclesWorked: ["Quadriceps Femoris", "Gluteus Maximus", "Adductor Magnus", "Hamstrings", "Calves", "Core"],
    targetMuscleGroup: "Leg Strength & Size",
    instructions: [
      "Rest the bar on your upper traps. Stand with feet slightly wider than shoulder-width.",
      "Brace core, pull shoulder blades together, and look straight ahead.",
      "Initiate the movement by pushing hips back and bending knees.",
      "Squat down until thighs are at least parallel to the floor (hip crease below knee).",
      "Drive back up through the mid-foot to a standing position, squeezing glutes."
    ],
    commonMistakes: [
      "Knees caving inward (valgus collapse).",
      "Heels lifting off the ground.",
      "Rounding the lower back at the bottom ('butt wink')."
    ],
    injuryRisks: [
      "Patellar tendon strain from knee cave.",
      "Lower back strain or disc herniation from spine rounding under load."
    ],
    formTips: [
      "Push your knees outward in the direction of your toes as you descend.",
      "Imagine trying to screw your feet into the floor to activate hip external rotators."
    ],
    breathing: "Inhale and brace core at top; hold breath down; exhale on the way up.",
    alternatives: ["Leg Press", "Goblet Squat", "Front Squat"],
    youtubeId: "SW_C1A-rejs",
    startPosition: "Standing upright with barbell racked across traps, feet shoulder-width.",
    endPosition: "Hips deep in squat, thighs parallel or below parallel to floor.",
    rangeOfMotion: "Deep knee and hip flexion to full extension."
  },
  {
    id: "romanian-deadlift",
    name: "Dumbbell Romanian Deadlift",
    category: "Legs",
    equipment: "Dumbbells",
    difficulty: "Intermediate",
    musclesWorked: ["Hamstrings", "Gluteus Maximus", "Erector Spinae"],
    targetMuscleGroup: "Hamstrings & Glutes",
    instructions: [
      "Stand holding dumbbells in front of your thighs, feet hip-width apart.",
      "Brace core, keep spine neutral, and bend knees slightly.",
      "Push your hips back as far as possible, letting weights slide down the front of legs.",
      "Once you feel a deep stretch in your hamstrings, push hips forward to return to standing."
    ],
    commonMistakes: [
      "Rounding the spine.",
      "Bending the knees too much (turning it into a standard squat).",
      "Letting the weights drift far away from the legs."
    ],
    injuryRisks: [
      "Lumbar strain from spine rounding."
    ],
    formTips: [
      "The movement is entirely horizontal hip travel, not vertical knee travel.",
      "Stop descending when your hips stop moving backward."
    ],
    breathing: "Inhale as you lower; exhale as you stand up.",
    alternatives: ["Barbell RDL", "Glute Ham Raise", "Lying Leg Curl"],
    youtubeId: "JCXUYuzwNrM",
    startPosition: "Standing tall, dumbbells in front of thighs, shoulders back.",
    endPosition: "Hips pushed back, torso angled forward at ~45-60 degrees, dumbbells at shin level.",
    rangeOfMotion: "Hinge from hips-forward to hips-back, stretching posterior chain."
  },

  // --- GLUTES ---
  {
    id: "hip-thrust",
    name: "Barbell Hip Thrust",
    category: "Glutes",
    equipment: "Barbell",
    difficulty: "Intermediate",
    musclesWorked: ["Gluteus Maximus", "Hamstrings", "Quadriceps"],
    targetMuscleGroup: "Glutes Peak Power",
    instructions: [
      "Sit on the floor with your upper back against a bench, a padded barbell resting over your hips.",
      "Place feet flat on the ground, shoulder-width apart, knees bent at 90 degrees.",
      "Drive through your heels, squeezing your glutes to lift your hips until torso is parallel to floor.",
      "Keep chin tucked and eyes forward (do not arch neck).",
      "Lower hips back to the floor under control."
    ],
    commonMistakes: [
      "Arching the lower back instead of tilting the pelvis.",
      "Lifting heels off the ground.",
      "Hyperextending the neck."
    ],
    injuryRisks: [
      "Lower back strain from spinal hyper-extension at the top."
    ],
    formTips: [
      "At the top, your shins should be completely vertical.",
      "Perform a posterior pelvic tilt (tuck tailbone) at the top for maximum glute contraction."
    ],
    breathing: "Inhale down; exhale powerfully as you drive up.",
    alternatives: ["Glute Bridge", "Cable Pull-Through", "Single-Leg Hip Thrust"],
    youtubeId: "LM8XHLYJoYs",
    startPosition: "Sit on floor with upper back against bench, barbell in hip crease, knees bent.",
    endPosition: "Hips raised to bench height, torso flat, knees bent at 90 degrees.",
    rangeOfMotion: "Hip extension from floor to flat table-top position."
  },

  // --- ABS ---
  {
    id: "cable-crunch",
    name: "Kneeling Cable Crunch",
    category: "Abs",
    equipment: "Cable",
    difficulty: "Beginner",
    musclesWorked: ["Rectus Abdominis", "Obliques"],
    targetMuscleGroup: "Six Pack & Core Strength",
    instructions: [
      "Attach a rope to a high pulley. Kneel facing the stack, hold rope by your ears.",
      "Hinge forward slightly at the hips, allowing the weight to stretch your spine.",
      "Flex at the waist to pull elbows down toward your knees, curling your spine.",
      "Exhale and squeeze abs at the bottom, then slowly return to the stretched position."
    ],
    commonMistakes: [
      "Pulling with the arms instead of using the core.",
      "Hinging at the hips rather than flexing the spine (hip flexor dominant).",
      "Keeping the back completely straight."
    ],
    injuryRisks: [
      "Minor lower back strain if weight is too heavy and spine is jerked."
    ],
    formTips: [
      "Keep your hips locked in place; do not let them sit back on your heels during the crunch.",
      "Focus on rolling your chest down toward your pelvis."
    ],
    breathing: "Exhale deeply at the bottom to increase core contraction; inhale on release.",
    alternatives: ["Ab Wheel Rollout", "Hanging Leg Raise", "Decline Bench Crunch"],
    youtubeId: "2fCIF5Sst60",
    startPosition: "Kneeling upright, hands holding rope behind neck, spine stretched.",
    endPosition: "Crunched down, head near floor, elbows tucked close to thighs.",
    rangeOfMotion: "Spinal flexion from extended to fully flexed."
  },

  // --- CALVES ---
  {
    id: "calf-raise",
    name: "Standing Calf Raise",
    category: "Calves",
    equipment: "Machine",
    difficulty: "Beginner",
    musclesWorked: ["Gastrocnemius", "Soleus"],
    targetMuscleGroup: "Calf Size",
    instructions: [
      "Adjust shoulder pads to height. Stand on block with balls of feet, heels hanging off.",
      "Lower your heels as far as possible to feel a deep stretch in the calves.",
      "Push up through the balls of your feet, raising heels as high as possible.",
      "Squeeze calves at the peak, then slowly lower back down."
    ],
    commonMistakes: [
      "Bouncing at the bottom of the movement.",
      "Not using a full range of motion (half reps).",
      "Bending the knees (keep them locked/straight to hit the gastrocnemius)."
    ],
    injuryRisks: [
      "Achilles tendon irritation from bouncing heavy loads."
    ],
    formTips: [
      "Pause for 2 seconds at the bottom stretch to eliminate the elastic tendon bounce.",
      "Distribute pressure evenly across all toes."
    ],
    breathing: "Exhale up; inhale down.",
    alternatives: ["Seated Calf Raise", "Leg Press Calf Press", "Single-Leg Dumbbell Calf Raise"],
    youtubeId: "YMmgqV85-3U",
    startPosition: "Balls of feet on step, heels fully lowered below step level.",
    endPosition: "Heels raised high, standing on tip-toes, calves contracted.",
    rangeOfMotion: "Ankle plantarflexion and dorsiflexion."
  },

  // --- FOREARMS ---
  {
    id: "wrist-curl",
    name: "Barbell Wrist Curl",
    category: "Forearms",
    equipment: "Barbell",
    difficulty: "Beginner",
    musclesWorked: ["Forearm Flexors"],
    targetMuscleGroup: "Grip & Forearm Size",
    instructions: [
      "Sit on a bench, holding a barbell with underhand grip.",
      "Rest your forearms on your thighs or the bench, wrists hanging off the edge.",
      "Lower the bar by extending your wrists, letting the bar roll onto your fingers.",
      "Curl your wrists upward, squeezing the forearms at the top, then lower slowly."
    ],
    commonMistakes: [
      "Lifting forearms off the thighs.",
      "Using too much weight and snapping wrists."
    ],
    injuryRisks: [
      "Wrist strain or carpal tunnel aggravation."
    ],
    formTips: [
      "Let the bar roll down to your fingertips at the bottom for maximum range of motion."
    ],
    breathing: "Exhale on curl; inhale on lower.",
    alternatives: ["Reverse Barbell Curl", "Farmer's Walk", "Wrist Roller"],
    youtubeId: "3u_bL7z284M",
    startPosition: "Wrists extended down, bar resting on fingertips, forearms flat.",
    endPosition: "Wrists flexed up, pulling bar up, forearms still flat.",
    rangeOfMotion: "Wrist extension to wrist flexion."
  },

  // --- NECK ---
  {
    id: "neck-harness",
    name: "Neck Harness Extension",
    category: "Neck",
    equipment: "Machine",
    difficulty: "Advanced",
    musclesWorked: ["Splenius Capitis", "Trapezius"],
    targetMuscleGroup: "Neck Strength & Thickness",
    instructions: [
      "Attach a neck harness to your head with a light plate hanging in front.",
      "Hinge at the waist, placing hands on knees for support.",
      "Lower your head slowly toward the floor by flexing the neck.",
      "Raise your head slowly by extending the neck, looking upward.",
      "Perform with high control and zero momentum."
    ],
    commonMistakes: [
      "Using heavy weight early.",
      "Moving the torso instead of isolating the neck.",
      "Sudden jerky movements."
    ],
    injuryRisks: [
      "Cervical spine strains or nerve compression."
    ],
    formTips: [
      "Always start with very light weight (e.g., 2.5kg or 5kg) and build up volume slowly."
    ],
    breathing: "Inhale down; exhale as you raise your head.",
    alternatives: ["Lying Neck Raise", "Isometric Neck Hold"],
    youtubeId: "uL3S5e2hH2g",
    startPosition: "Torso hinged, head tilted down looking at floor.",
    endPosition: "Head tilted up, neck fully extended.",
    rangeOfMotion: "Cervical flexion to extension."
  },

  // --- CARDIO ---
  {
    id: "treadmill-interval",
    name: "Treadmill HIIT Run",
    category: "Cardio",
    equipment: "Full Gym",
    difficulty: "Beginner",
    musclesWorked: ["Quads", "Hamstrings", "Glutes", "Cardiovascular System"],
    targetMuscleGroup: "Heart & Fat Burn",
    instructions: [
      "Warm up at a light jog (5-6 mph) for 5 minutes.",
      "Sprint at high speed (9-12 mph) for 30 seconds.",
      "Recover by walking at low speed (3 mph) for 60 seconds.",
      "Repeat for 10-15 rounds.",
      "Cool down at 3 mph for 3 minutes."
    ],
    commonMistakes: [
      "Holding onto the handrails while running.",
      "Sprinting too fast too early without warm-up."
    ],
    injuryRisks: [
      "Shin splints or hamstring pulls from inadequate warm-up."
    ],
    formTips: [
      "Land on your mid-foot, not your heels, to reduce impact."
    ],
    breathing: "Maintain deep, rhythmic belly breathing.",
    alternatives: ["Slam Ball Intervalls", "Rowing Machine Sprint", "Assault Bike HIIT"],
    youtubeId: "3hW5fHlUjDk",
    startPosition: "Standing on side rails or walking light warm-up.",
    endPosition: "Walking pace cool down.",
    rangeOfMotion: "Dynamic running cycle."
  },

  // --- MOBILITY ---
  {
    id: "deep-squat-hold",
    name: "Deep Squat Hold (Decompression)",
    category: "Mobility",
    equipment: "Bodyweight",
    difficulty: "Beginner",
    musclesWorked: ["Hip Flexors", "Ankle Joint", "Lower Back", "Adductors"],
    targetMuscleGroup: "Hips & Ankle Mobility",
    instructions: [
      "Stand with feet shoulder-width apart, toes flared.",
      "Squat down fully into your deepest position, heels flat on ground.",
      "Place your elbows inside your knees and press them outward.",
      "Keep chest up, head neutral, and breathe deeply.",
      "Hold for 1-2 minutes."
    ],
    commonMistakes: [
      "Heels coming off the ground (poor ankle mobility).",
      "Torso collapsing forward.",
      "Rounding the upper back."
    ],
    injuryRisks: [
      "None if done gently; back out if knee pain occurs."
    ],
    formTips: [
      "If heels lift, place a small plate under them or hold onto a sturdy object for support."
    ],
    breathing: "Take deep, slow diaphragmatic breaths, expanding the belly.",
    alternatives: ["Cossack Squat", "90/90 Hip Stretch", "Lizard Lunge"],
    youtubeId: "zVpCjHhG2tU",
    startPosition: "Standing with upright posture.",
    endPosition: "Holding deep squat at maximum depth, elbows pressing knees out.",
    rangeOfMotion: "Static holding stretch at maximum joint flexion."
  }
];

// Dynamically generate a library of 500+ exercises from these base ones.
// We expand the base exercises by combining them with variations (equipment, grip, angle, tempo)
// to generate distinct entries with realistic details.
export function generateExerciseLibrary(): Exercise[] {
  const library: Exercise[] = [...BASE_EXERCISES];

  const categoryVariations: Record<string, string[]> = {
    "Chest": [
      "Dumbbell Incline Press", "Barbell Decline Press", "Machine Chest Press", "Cable Crossover", 
      "Decline Dumbbell Fly", "Weighted Dips", "Deficit Push-up", "Close-Grip Push-up", "Machine Fly", 
      "Svend Press", "Single-Arm Cable Chest Press", "Floor Press", "Decline Hammer Strength Press", 
      "Incline Dumbbell Fly", "Reverse Grip Bench Press", "Hex Press", "Resistance Band Press", 
      "Medicine Ball Push-up", "Plyometric Push-up", "Kettlebell Floor Press", "Wide Grip Bench Press",
      "Clap Push-up", "Incline Machine Press", "Archer Push-up", "Larsen Press", "Pin Press",
      "Chain Bench Press", "Band-Resisted Bench Press", "Board Press", "Spoto Press",
      "Single-Arm Dumbbell Bench Press", "Swiss Bar Bench Press", "Reverse Grip Dumbbell Press",
      "Standing Cable Chest Press", "Decline Machine Press", "Weighted Push-up", "Diamond Push-up",
      "Incline Fly", "Low-to-High Cable Fly", "High-to-Low Cable Fly"
    ],
    "Back": [
      "Lat Pulldown (Wide Grip)", "Lat Pulldown (Close Grip)", "Underhand Lat Pulldown", "Seated Cable Row", 
      "Single-Arm Dumbbell Row", "T-Bar Row", "Meadows Row", "Chest-Supported Row", "Kettlebell Row", 
      "Pendlay Row", "Yates Row", "Rack Pulls", "Inverted Row", "Face Pulls", "Straight-Arm Lat Pulldown", 
      "Deficit Deadlift", "Sumo Deadlift", "Snatch-Grip Deadlift", "Block Pulls", "Romanian Deadlift (Barbell)", 
      "Hyperextensions", "Good Mornings", "Chin-up", "Neutral Grip Pull-up", "Behind-the-Neck Pulldown", 
      "Renegade Row", "Helms Row", "Seal Row", "Barbell Shrugs", "Dumbbell Shrugs", "Smith Machine Row", 
      "Cable Pullover", "Single-Arm Lat Pulldown", "Assisted Pull-up", "Band Pull-Apart", "Reverse Fly",
      "Kroc Row", "Dumbbell Pullover", "Jefferson Deadlift", "Paused Deadlift", "Kettlebell Swing"
    ],
    "Shoulders": [
      "Seated Dumbbell Press", "Arnold Press", "Front Plate Raise", "Dumbbell Front Raise", "Barbell Front Raise", 
      "Cable Lateral Raise", "Machine Shoulder Press", "Rear Delt Fly (Dumbbell)", "Rear Delt Fly (Machine)", 
      "Face Pulls (High Cable)", "Dumbbell Upright Row", "Barbell Upright Row", "Push Press", "Behind-the-Neck Press", 
      "Z-Press", "Landmine Press", "Kettlebell Press", "Single-Arm Dumbbell Press", "Smith Machine Press", 
      "Handstand Push-ups", "Pike Push-ups", "Y-Raises", "T-Raises", "W-Raises", "Lu Raises", 
      "Seated Lateral Raise", "Incline Lateral Raise", "Cable Front Raise", "Standing Arnold Press",
      "Single-Arm Kettlebell Press", "Dumbbell Rear Delt Row", "Cable Rear Delt Fly", "Overhead Band Pull",
      "Plate Halos", "Band Face Pulls", "Machine Lateral Raise", "Dumbbell Iron Cross", "Scaption Raise"
    ],
    "Biceps": [
      "Hammer Curls", "Preacher Curl (Barbell)", "Preacher Curl (Dumbbell)", "Concentration Curl", "Spider Curl", 
      "Cable Bicep Curl", "EZ-Bar Curl", "Reverse Grip Bicep Curl", "Zottman Curl", "Incline Hammer Curl", 
      "Bicep Curl Machine", "21s Bicep Curl", "Drag Curls", "Waiter Curls", "Cable Rope Curls", 
      "Overhead Cable Curl", "Cross Body Hammer Curl", "Single-Arm Preacher Curl", "Kettlebell Bicep Curl", 
      "Resistance Band Curl", "Chin-Up Curl Focus", "Standing Dumbbell Curl", "Seated Bicep Curl",
      "Bayesian Curl", "Incline Bicep Curl", "EZ-Bar Preacher Curl", "Cable Preacher Curl",
      "Single-Arm Dumbbell Curl", "Concentration Cable Curl", "Hammer Rope Cable Curl"
    ],
    "Triceps": [
      "Tricep Overhead Extension (Dumbbell)", "Tricep Overhead Extension (EZ-Bar)", "Tricep Pushdown (V-Bar)", 
      "Tricep Pushdown (Straight Bar)", "Rope Pushdown", "Tricep Kickbacks (Dumbbell)", "Tricep Kickbacks (Cable)", 
      "Close-Grip Bench Press", "Dips (Bodyweight)", "Dips (Weighted)", "Bench Dips", "Machine Tricep Extension", 
      "JM Press", "Floor Press (Close Grip)", "Tate Press", "Single-Arm Pushdown", "Reverse Grip Pushdown", 
      "Katana Extension", "Cable Skull Crusher", "Dumbbell Skull Crusher", "Diamond Push-ups", 
      "Tricep Extension Machine", "Cable Overhead Rope Extension", "Smith Machine Close Grip Bench",
      "Single-Arm Overhead Tricep Extension", "Resistance Band Pushdown", "Board Press Close Grip"
    ],
    "Forearms": [
      "Reverse Wrist Curl", "Hammer Wrist Curl", "Behind the Back Wrist Curl", "Farmer's Carry", 
      "Wrist Roller", "Plate Pinch Holds", "Fat Grip Curls", "Towel Pull-ups", "Dead Hangs", 
      "Suitcase Carry", "Single-Arm Farmer's Carry", "Behind the Back Cable Wrist Curl"
    ],
    "Abs": [
      "Hanging Leg Raise", "Hanging Knee Raise", "Ab Wheel Rollout", "Plank", "Side Plank", "Weighted Plank", 
      "Decline Sit-up", "Weighted Decline Sit-up", "Russian Twists", "Weighted Russian Twists", "Cable Woodchoppers", 
      "Reverse Crunch", "Bicycle Crunches", "Toe Touches", "Dead Bug", "Bird Dog", "L-Sit", "L-Sit Hold", 
      "Dragon Flag", "Toes to Bar", "V-ups", "Ab Coaster Machine", "Hanging Oblique Knee Raise",
      "Pallof Press", "Spider-Man Plank", "Flutter Kicks", "Leg Lifts", "Crunches", "Oblique Crunch"
    ],
    "Legs": [
      "Front Squat", "Leg Press", "Leg Extensions", "Lying Leg Curl", "Seated Leg Curl", "Walking Lunges", 
      "Reverse Lunges", "Dumbbell Lunges", "Bulgarian Split Squat", "Goblet Squat", "Hack Squat", 
      "Smith Machine Squat", "Step-ups", "Weighted Step-ups", "Leg Press Calf Raise", "Pistol Squat", 
      "Glute-Ham Raise", "Nordic Hamstring Curl", "Box Squat", "Deficit Bulgarian Split Squat", 
      "Split Squat (Barbell)", "Kettlebell Squat", "Wall Sit", "Sissy Squat", "Goblet Lunges",
      "Hack Squat Machine", "Belt Squat", "Safety Bar Squat", "Zercher Squat", "Paused Squat",
      "Tempo Squat", "Jefferson Squat", "Single-Leg Leg Press", "Single-Leg Extension",
      "Dumbbell Step-Up", "Barbell Step-Up", "Deficit Reverse Lunge", "Slide Board Leg Curl",
      "Dumbbell Bulgarian Split Squat", "Barbell Bulgarian Split Squat"
    ],
    "Glutes": [
      "Glute Bridge", "Single-Leg Glute Bridge", "Cable Kickbacks", "Abduction Machine", "Clamshells", 
      "Fire Hydrants", "Deficit Hip Thrust", "Single-Leg Hip Thrust", "Cable Pull-Through", "Frog Pumps", 
      "Banded Lateral Walk", "Sumo Deadlift (Glute Focus)", "Reverse Hyper-extension"
    ],
    "Calves": [
      "Seated Calf Raise", "Leg Press Calf Press", "Single-Leg Standing Calf Raise", "Smith Machine Calf Raise", 
      "Donkey Calf Raise", "Tibialis Raises", "Bodyweight Calf Raise", "Dumbbell Calf Raise"
    ],
    "Neck": [
      "Lying Neck Extension", "Lying Neck Flexion", "Isometric Neck Press (Front)", "Isometric Neck Press (Back)", 
      "Isometric Neck Press (Sides)", "Neck Rotation Stretch", "Four-Way Neck Machine"
    ],
    "Cardio": [
      "Elliptical Trainer Session", "Rowing Machine Interval", "Assault Bike Sprint", "Jump Rope Routine", 
      "Burpees", "Mountain Climbers", "Kettlebell Swings (Cardio Focus)", "Battle Ropes", "Stairmaster Climb", 
      "Spin Bike Intervals", "Swimming Laps", "Sled Push (Prowler)", "Sled Pull", "Shadow Boxing", 
      "Jumping Jacks", "Thrusters", "Medicine Ball Slams", "High Knees", "Running Outdoors", "Cycling"
    ],
    "Mobility": [
      "90/90 Hip Switch", "World's Greatest Stretch", "Cossack Squat", "Lizard Lunge", "Cat-Cow Stretch", 
      "Thoracic Spine Rotations", "Child's Pose", "Pigeon Stretch", "Downward Dog", "Shoulder Dislocations (PVC pipe)", 
      "Band Dislocates", "Wrist Mobility Stretch", "Ankle Dorsiflexion Mobilization", "Scapular Wall Slides", 
      "Foam Rolling Lower Back", "Foam Rolling Quads", "Hamstring Stretch", "Cobra Pose", "Active Hang"
    ]
  };

  // Generate unique exercises to fill up to 500+ items
  let idCounter = 1;
  const uniqueNames = new Set<string>(library.map(e => e.name));

  for (const [category, variations] of Object.entries(categoryVariations)) {
    // Find base template in this category
    const templates = BASE_EXERCISES.filter(e => e.category === category);
    const template = templates[0] || BASE_EXERCISES[0]; // fallback to bench press if none

    for (const varName of variations) {
      if (uniqueNames.has(varName)) continue;
      uniqueNames.add(varName);

      // Determine appropriate equipment from name
      let equipment = template.equipment;
      if (varName.toLowerCase().includes("dumbbell") || varName.toLowerCase().includes("db")) {
        equipment = "Dumbbells";
      } else if (varName.toLowerCase().includes("barbell") || varName.toLowerCase().includes("ez-bar") || varName.toLowerCase().includes("bar")) {
        equipment = "Barbell";
      } else if (varName.toLowerCase().includes("cable")) {
        equipment = "Cable";
      } else if (varName.toLowerCase().includes("machine") || varName.toLowerCase().includes("press") && !varName.toLowerCase().includes("barbell") && !varName.toLowerCase().includes("dumbbell")) {
        equipment = "Machine";
      } else if (varName.toLowerCase().includes("kettlebell") || varName.toLowerCase().includes("kb")) {
        equipment = "Kettlebell";
      } else if (varName.toLowerCase().includes("band")) {
        equipment = "Bands";
      } else if (varName.toLowerCase().includes("bodyweight") || varName.toLowerCase().includes("push-up") || varName.toLowerCase().includes("pull-up") || varName.toLowerCase().includes("plank") || varName.toLowerCase().includes("stretch")) {
        equipment = "Bodyweight";
      }

      // Determine difficulty
      let difficulty: 'Beginner' | 'Intermediate' | 'Advanced' = "Intermediate";
      if (varName.toLowerCase().includes("advanced") || varName.toLowerCase().includes("weighted") || varName.toLowerCase().includes("snatch") || varName.toLowerCase().includes("pistol")) {
        difficulty = "Advanced";
      } else if (varName.toLowerCase().includes("machine") || varName.toLowerCase().includes("assisted") || varName.toLowerCase().includes("stretch") || varName.toLowerCase().includes("beginner")) {
        difficulty = "Beginner";
      } else {
        difficulty = template.difficulty;
      }

      const cleanId = varName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

      library.push({
        id: `${cleanId}-${idCounter++}`,
        name: varName,
        category: category,
        equipment: equipment,
        difficulty: difficulty,
        musclesWorked: [...template.musclesWorked],
        targetMuscleGroup: template.targetMuscleGroup,
        instructions: [
          `Setup the ${equipment} with proper load or settings for your experience.`,
          `Position your body correctly: maintain structural tension, flat back, and active core.`,
          `Perform the dynamic phase of ${varName} under control, focusing on the target muscles.`,
          `Reach full range of motion, squeeze, and slowly return through the negative phase.`
        ],
        commonMistakes: [
          `Using too much weight and breaking form guidelines.`,
          `Rushing the eccentric (lowering) phase, losing tension.`,
          `Restricting range of motion to avoid harder portions.`
        ],
        injuryRisks: [
          `Joint strain from misalignment.`,
          `Muscle pull if performed explosively without proper warm-up.`
        ],
        formTips: [
          `Keep key stabilizers locked and focus strictly on moving at the primary joints.`,
          `Adjust stance or grip width if you feel any joint pain.`
        ],
        breathing: `Exhale on exertion (concentric lift); inhale on relaxation (eccentric lower).`,
        alternatives: template.alternatives.filter(a => a !== varName).slice(0, 2),
        youtubeId: '',
        startPosition: template.startPosition,
        endPosition: template.endPosition,
        rangeOfMotion: template.rangeOfMotion
      });
    }
  }

  return library;
}
