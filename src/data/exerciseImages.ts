const gifBase = 'https://static.exercisedb.dev/media';
const imageBase = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises';

// ExerciseDB GIF mappings (by exact exercise name)
const exerciseGifs: Record<string, string> = {
  'Barbell Bench Press': `${gifBase}/EIeI8Vf.gif`,
  'Standing Cable Fly': `${gifBase}/0CXGHya.gif`,
  'Barbell Deadlift': `${gifBase}/ila4NZS.gif`,
  'Pull-Up': `${gifBase}/0V2YQjW.gif`,
  'Bent-Over Barbell Row': `${gifBase}/eZyBC3j.gif`,
  'Barbell Overhead Press': `${gifBase}/Kyd9Rz5.gif`,
  'Dumbbell Lateral Raise': `${gifBase}/DsgkuIt.gif`,
  'Barbell Bicep Curl': `${gifBase}/25GPyDY.gif`,
  'Cable Tricep Pushdown': `${gifBase}/3ZflifB.gif`,
  'EZ-Bar Skull Crusher': `${gifBase}/h8LFzo9.gif`,
  'Barbell Back Squat': `${gifBase}/DhMl549.gif`,
  'Dumbbell Romanian Deadlift': `${gifBase}/rR0LJzx.gif`,
  'Standing Calf Raise': `${gifBase}/8ozhUIZ.gif`,
  'Kneeling Cable Crunch': `${gifBase}/WW95auq.gif`,
  'Barbell Wrist Curl': `${gifBase}/82LxxkW.gif`,
  'Treadmill HIIT Run': `${gifBase}/rjiM4L3.gif`,
  'Deep Squat Hold (Decompression)': `${gifBase}/DhMl549.gif`,
  'Underhand Lat Pulldown': `${gifBase}/0I5fUyn.gif`,
  'T-Bar Row': `${gifBase}/aaXr7ld.gif`,
  'Kettlebell Row': `${gifBase}/4KJEpzb.gif`,
  'Pendlay Row': `${gifBase}/4OaumBr.gif`,
  'Yates Row': `${gifBase}/1u36hhy.gif`,
  'Inverted Row': `${gifBase}/1YUWDNZ.gif`,
  'Straight-Arm Lat Pulldown': `${gifBase}/DT14T9T.gif`,
  'Good Mornings': `${gifBase}/1bQkKZK.gif`,
  'Neutral Grip Pull-up': `${gifBase}/pP8wP2P.gif`,
  'Renegade Row': `${gifBase}/b9kqlBy.gif`,
  'Seal Row': `${gifBase}/9fCHfSc.gif`,
  'Barbell Shrugs': `${gifBase}/1oE78pm.gif`,
  'Dumbbell Shrugs': `${gifBase}/1kB3Wmk.gif`,
  'Cable Pullover': `${gifBase}/0MlxeMn.gif`,
  'Assisted Pull-up': `${gifBase}/5ipN0iE.gif`,
  'Reverse Fly': `${gifBase}/0IgNjSM.gif`,
  'Kroc Row': `${gifBase}/JGKowMS.gif`,
  'Dumbbell Pullover': `${gifBase}/3tAXPQ6.gif`,
  'Kettlebell Swing': `${gifBase}/5bpPTHv.gif`,
  'Arnold Press': `${gifBase}/dCPESfR.gif`,
  'Front Plate Raise': `${gifBase}/sTg7iys.gif`,
  'Cable Lateral Raise': `${gifBase}/4c9BhzB.gif`,
  'Machine Shoulder Press': `${gifBase}/1TkiAFK.gif`,
  'Dumbbell Upright Row': `${gifBase}/1oE78pm.gif`,
  'Push Press': `${gifBase}/1cTf2Ux.gif`,
  'Behind-the-Neck Press': `${gifBase}/Gpn4ADc.gif`,
  'Z-Press': `${gifBase}/0dCyly0.gif`,
  'Landmine Press': `${gifBase}/2Pya1cP.gif`,
  'Kettlebell Press': `${gifBase}/5bpPTHv.gif`,
  'Smith Machine Press': `${gifBase}/7WcQgkm.gif`,
  'Handstand Push-ups': `${gifBase}/rQxwMxO.gif`,
  'Y-Raises': `${gifBase}/aHDy5O5.gif`,
  'Seated Lateral Raise': `${gifBase}/53Ttlck.gif`,
  'Incline Lateral Raise': `${gifBase}/53Ttlck.gif`,
  'Standing Arnold Press': `${gifBase}/1cTf2Ux.gif`,
  'Weighted Dips': `${gifBase}/0lQnxMZ.gif`,
  'Floor Press': `${gifBase}/67n3r98.gif`,
  'Reverse Grip Bench Press': `${gifBase}/641mIfk.gif`,
  'Chin-up': `${gifBase}/dVeWXf2.gif`,
  'Barbell Front Raise': `${gifBase}/b2Uoz54.gif`,
  'Barbell Upright Row': `${gifBase}/83HoW9X.gif`,
  'Front Squat': `${gifBase}/DB0n8AG.gif`,
  'Leg Press': `${gifBase}/10Z2DXU.gif`,
  'Lying Leg Curl': `${gifBase}/17lJ1kr.gif`,
  'Seated Leg Curl': `${gifBase}/8oYqOt9.gif`,
  'Walking Lunges': `${gifBase}/IZVHb27.gif`,
  'Pistol Squat': `${gifBase}/5bpPTHv.gif`,
  'Box Squat': `${gifBase}/5bpPTHv.gif`,
  'Glute Bridge': `${gifBase}/GibBPPg.gif`,
  'Donkey Calf Raise': `${gifBase}/0jp9Rlz.gif`,
  'Ab Wheel Rollout': `${gifBase}/KtRomty.gif`,
  'Seated Calf Raise': `${gifBase}/2ORFMoR.gif`,
  'Sumo Deadlift': `${gifBase}/KgI0tqW.gif`,
  'Diamond Push-up': `${gifBase}/soIB2rj.gif`,
  'Diamond Push-ups': `${gifBase}/soIB2rj.gif`,
  'Tricep Kickbacks (Dumbbell)': `${gifBase}/Gi2BXfK.gif`,
  'Dumbbell Step-Up': `${gifBase}/7858za8.gif`,
  'Goblet Squat': `${gifBase}/yn8yg1r.gif`,
  'Hack Squat': `${gifBase}/5VCj6iH.gif`,
  'Bulgarian Split Squat': `${gifBase}/HUEqZ1y.gif`,
  'Push-Up': `${gifBase}/0br45wL.gif`,
  'Dips (Bodyweight)': `${gifBase}/05Cf2v8.gif`,
  'Bench Dips': `${gifBase}/7xI5MXA.gif`,
  'Mountain Climbers': `${gifBase}/RJgzwny.gif`,
  'Reverse Crunch': `${gifBase}/eOG0r6v.gif`,
  'Hyperextensions': `${gifBase}/zhMwOwE.gif`,
  'Hanging Knee Raise': `${gifBase}/03lzqwk.gif`,
  'Bicycle Crunches': `${gifBase}/tZkGYZ9.gif`,
  'Cable Crunch': `${gifBase}/9Ap7miY.gif`,
  'Romanian Deadlift (Barbell)': `${gifBase}/rR0LJzx.gif`,
  'Dumbbell Bicep Curl': `${gifBase}/2NpxjC1.gif`,
  'Concentration Curl': `${gifBase}/7inpWch.gif`,
  'Sissy Squat': `${gifBase}/xdYPUtE.gif`,
  'Close-Grip Bench Press': `${gifBase}/7jGOBF3.gif`,
  'Decline Sit-up': `${gifBase}/tZkGYZ9.gif`,
};

function toSnake(s: string): string {
  const cleaned = s.replace(/['']/g, '').replace(/[^a-zA-Z0-9]+/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
  return cleaned;
}

// All free-exercise-db directory names (500 directories with JPG images)
const freeDbDirs: string[] = [
  "3_4_Sit-Up", "90_90_Hamstring", "Ab_Crunch_Machine", "Ab_Roller", "Adductor", "Adductor_Groin", "Advanced_Kettlebell_Windmill", "Air_Bike", "All_Fours_Quad_Stretch", "Alternate_Hammer_Curl", "Alternate_Heel_Touchers", "Alternate_Incline_Dumbbell_Curl", "Alternate_Leg_Diagonal_Bound", "Alternating_Cable_Shoulder_Press", "Alternating_Deltoid_Raise", "Alternating_Floor_Press", "Alternating_Hang_Clean", "Alternating_Kettlebell_Press", "Alternating_Kettlebell_Row", "Alternating_Renegade_Row", "Ankle_Circles", "Ankle_On_The_Knee", "Anterior_Tibialis-SMR", "Anti-Gravity_Press", "Arm_Circles", "Arnold_Dumbbell_Press", "Around_The_Worlds", "Atlas_Stone_Trainer", "Atlas_Stones", "Axle_Deadlift", "Back_Flyes_-_With_Bands", "Backward_Drag", "Backward_Medicine_Ball_Throw", "Balance_Board", "Ball_Leg_Curl", "Band_Assisted_Pull-Up", "Band_Good_Morning", "Band_Good_Morning_Pull_Through", "Band_Hip_Adductions", "Band_Pull_Apart", "Band_Skull_Crusher", "Barbell_Ab_Rollout", "Barbell_Ab_Rollout_-_On_Knees", "Barbell_Bench_Press_-_Medium_Grip", "Barbell_Curl", "Barbell_Curls_Lying_Against_An_Incline", "Barbell_Deadlift", "Barbell_Full_Squat", "Barbell_Glute_Bridge", "Barbell_Guillotine_Bench_Press", "Barbell_Hack_Squat", "Barbell_Hip_Thrust", "Barbell_Incline_Bench_Press_-_Medium_Grip", "Barbell_Incline_Shoulder_Raise", "Barbell_Lunge", "Barbell_Rear_Delt_Row", "Barbell_Rollout_from_Bench", "Barbell_Seated_Calf_Raise", "Barbell_Shoulder_Press", "Barbell_Shrug", "Barbell_Shrug_Behind_The_Back", "Barbell_Side_Bend", "Barbell_Side_Split_Squat", "Barbell_Squat", "Barbell_Squat_To_A_Bench", "Barbell_Step_Ups", "Barbell_Walking_Lunge", "Battling_Ropes", "Bear_Crawl_Sled_Drags", "Behind_Head_Chest_Stretch", "Bench_Dips", "Bench_Jump", "Bench_Press_-_Powerlifting", "Bench_Press_-_With_Bands", "Bench_Press_with_Chains", "Bench_Sprint", "Bent-Arm_Barbell_Pullover", "Bent-Arm_Dumbbell_Pullover", "Bent-Knee_Hip_Raise", "Bent_Over_Barbell_Row", "Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench", "Bent_Over_Low-Pulley_Side_Lateral", "Bent_Over_One-Arm_Long_Bar_Row", "Bent_Over_Two-Arm_Long_Bar_Row", "Bent_Over_Two-Dumbbell_Row", "Bent_Over_Two-Dumbbell_Row_With_Palms_In", "Bent_Press", "Bicycling", "Bicycling_Stationary", "Board_Press", "Body-Up", "Body_Tricep_Press", "Bodyweight_Flyes", "Bodyweight_Mid_Row", "Bodyweight_Squat", "Bodyweight_Walking_Lunge", "Bosu_Ball_Cable_Crunch_With_Side_Bends", "Bottoms-Up_Clean_From_The_Hang_Position", "Bottoms_Up", "Box_Jump_Multiple_Response", "Box_Jump_Spread", "Box_Squat", "Box_Squat_With_Bands", "Bulgarian_Split_Squat", "Burpee", "Butt_Kicks", "Butterfly_Stretch", "Cable_Chest_Press", "Cable_Crossover", "Cable_Curl", "Cable_Hip_Adduction", "Cable_Incline_Triceps_Extension", "Cable_Incline_Pushdown", "Cable_Internal_External_Rotation", "Cable_lying_Triceps_Extension", "Cable_One_Arm_Tricep_Pushdown", "Cable_Rear_Delt_Fly", "Cable_Reverse_Curl", "Cable_Seated_Crunch", "Cable_Shoulder_Press", "Cable_Supine_Triceps_Extension", "Cable_Tricep_Pushdown", "Calf_Machine_Shoulder_Shrug", "Calf_Raise_On_A_Step", "Calf_Stretch_With_Band", "Calf_Stretching", "Cambered_Bar_Lying_Row", "Captain's_Chair", "Car_Driver", "Carioca_Quick_Step", "Catch_and_Overhead_Throw", "Chain_Handle_Extension", "Chair_Squat", "Chair_Upper_Body_Stretch", "Chest_Dip", "Chest_Dip_On_Chair", "Chest_Stretch_On_Stability_Ball", "Child's_Pose", "Chin-Up", "Chin_To_Chest_Stretch", "Clam", "Clean_Deadlift", "Clean_Pull", "Clean_Shrug", "Close-Grip_Barbell_Bench_Press", "Close-Grip_Barbell_Triceps_Extension", "Close-Grip_Dumbbell_Press", "Close-Grip_EZ-Bar_Triceps_Extension", "Close-Grip_Push-up_off_of_a_Dumbbell", "Cocoons", "Concentration_Curl", "Contract_Relax_Stretch", "Cossack_Squat", "Cradle_Walk", "Crunches", "Cuban_Press", "Curl_Bar_Shrug", "Deadlift_with_Bands", "Decline_Barbell_Bench_Press", "Decline_Bench_Press_-_With_Bands", "Decline_Bench_Press_with_Chains", "Decline_Dumbbell_Bench_Press", "Decline_Dumbbell_Triceps_Extension", "Decline_Dumbbell_V-Up", "Decline_EZ_Bar_Triceps_Extension", "Decline_Oblique_Crunch", "Decline_Push-Up", "Deep_Jump", "Deficit_Deadlift", "Deficit_Push-Up", "Diagonal_Hold", "Dips_-_Chest_Version", "Dips_-_Triceps_Version", "Donkey_Calf_Raise", "Double_Cable_Triceps_Extension", "Double_Leg_Butt_Kick", "Double_Push-Up", "Downward_Facing_Balance", "Drag_Curl", "Drop_Push", "Dumbbell_Bench_Press", "Dumbbell_Bench_Press_with_Neutral_Grip", "Dumbbell_Bicep_Curl", "Dumbbell_Clean", "Dumbbell_Floor_Press", "Dumbbell_Flyes", "Dumbbell_Front_Raise", "Dumbbell_Goblet_Squat", "Dumbbell_Hammer_Curl", "Dumbbell_Incline_Bench_Press", "Dumbbell_Incline_Row", "Dumbbell_Lateral_Raise", "Dumbbell_Lunges", "Dumbbell_Lying_One-Arm_Triceps_Extension", "Dumbbell_Lying_Pronation", "Dumbbell_Lying_Triceps_Extension", "Dumbbell_One-Arm_Triceps_Extension", "Dumbbell_Push-Up", "Dumbbell_Rear_Delt_Row", "Dumbbell_Reverse_Curl", "Dumbbell_Romanian_Deadlift", "Dumbbell_Seated_Triceps_Extension", "Dumbbell_Shrug", "Dumbbell_Side_Bend", "Dumbbell_Step_Ups", "Dumbbell_Triceps_Extension", "Dumbbell_Triceps_Pushdown", "Dumbbell_Upright_Row", "Dynamic_Back_Stretch", "Dynamic_Chest_Stretch", "EZ-Bar_Curl", "Elbow_Lift_-_Reverse_Push-ups", "Elevated_Back_Lunge", "Elevated_Cable_Row", "Elliptical_Trainer", "Exercise_Ball_Crunch", "Exercise_Ball_Pull-In", "External_Shoulder_Rotation", "External_Shoulder_Rotation_-_With_Bands", "Face_Pull", "Farmer's_Walk", "Fast_Kicking", "Figure_4_Stretch", "Fire_Hydrant", "Flat_Bench_Cable_Flyes", "Flat_Bench_Leg_Pull-In", "Flexor_Incline_Dumbbell_Curls", "Floor_Glute-Ham_Raise", "Floor_Hyperextension", "Flutter_Kicks", "Foot_And_Ankle_Roll", "Forward_Lunges", "Forward_Stretch", "Four_Headstretch", "Frankenstein_Squat", "Freehand_Jump_Squat", "Frog_Hops", "Frog_Stand", "Front_Barbell_Squat", "Front_Bench_Raises", "Front_Box_Jump", "Front_Cable_Raise", "Front_Cone_Hops_(or_Shuttle_Hops)", "Front_Dumbbell_Raise", "Front_Incline_Dumbbell_Raise", "Front_Leg_Raises", "Front_Plate_Raise", "Front_Raise_And_Pullover", "Front_Squat_(With_Bands)", "Front_Squat_With_Two_Kettlebells", "Full_Range_Of_Motion_Triceps_Pushdown", "Glute_Bridge", "Glute_Bridge_Hamstring_Drag", "Glute_Ham_Raise_-_With_Bands", "Glute_Kickback", "Glute_Stretch", "Goblet_Squat", "Gorilla_Chin", "Groin_and_Back_Stretch", "Hack_Squat", "Hammer_Curls", "Hammer_Grip_Incline_DB_Bench_Press", "Handstand_Push-Ups", "Hang_Clean", "Hang_Finish", "Hang_Snatch", "Hanging_Bar_Good_Morning", "Hanging_Leg_Hip_Raise", "Hanging_Leg_Raise", "Hanging_Pike", "Hanging_Straight_Leg_Hip_Raise", "Hanging_Windshield_Wipers", "Hip_Circles", "Hip_Extension_With_Bands", "Hip_Flexor_Stretch", "Hip_Stretch", "Hyperextension", "Hyperextensions_(Back_Extensions)", "Inchworm", "Incline_Barbell_Triceps_Extension", "Incline_Bench_Pull", "Incline_Cable_Chest_Press", "Incline_Cable_Fly", "Incline_Dumbbell_Bench_Press", "Incline_Dumbbell_Curl", "Incline_Dumbbell_Flyes", "Incline_Dumbbell_Press", "Incline_Dumbbell_Triceps_Extension", "Incline_Hammer_Curls", "Incline_Inner_Biceps_Curl", "Incline_Push-Up", "Incline_Push-Up_Close-Grip", "Incline_Push-Up_Distance", "Incline_Push-Up_Medium", "Incline_Push-Up_Reverse", "Incline_Push-Up_Wide", "Intermediate_Hip_Flexor_Stretch", "Internal_Shoulder_Rotation", "Internal_Shoulder_Rotation_-_With_Bands", "Iron_Cross", "Isometric_Chest_Squeeze", "Isometric_Neck_Exercise_-_Front_And_Back", "Isometric_Neck_Exercise_-_Sides", "Isometric_Triceps", "Janda_Sit-up", "Jefferson_Deadlift", "JM_Press", "Jogging_Treadmill", "Jump_Rope", "Jump_Squat", "Jumping_Jack_With_Plate", "Keg_Load", "Kettlebell_Arnold_Press", "Kettlebell_Deadlift", "Kettlebell_Floor_Press", "Kettlebell_Lateral_Raise", "Kettlebell_Leg_Curl", "Kettlebell_Leg_Raise", "Kettlebell_Lunge", "Kettlebell_Pistol_Squat", "Kettlebell_Plate_Row", "Kettlebell_Press", "Kettlebell_Row", "Kettlebell_Seated_Press", "Kettlebell_Sumo_Deadlift", "Kettlebell_Swing", "Kettlebell_Thruster", "Kettlebell_Turkish_Get-Up", "Kick_Down", "Kipping_Hang_Pull", "Knee_Across_The_Body_Stretch", "Knee_Circles", "Knee_Hug", "Knee_Tuck_Jump", "Kneeling_Arm_Drag", "Kneeling_Cable_Crunch_With_Alternating_Oblique_Twists", "Kneeling_Cable_Triceps_Pushdown", "Kneeling_Front_Raise", "Kneeling_Hip_Stretch", "Kneeling_Jump_Squat", "Kneeling_One_Arm_Cable_Row", "Kneeling_Push-Up", "Kneeling_Stretch", "Kneeling_Torso_Twist", "Landmine_180's", "Landmine_Lateral_Row", "Landmine_Press", "Lateral_Bound", "Lateral_Cone_Hops", "Lateral_Jump_Squat", "Lateral_Lunges", "Lateral_Step_Ups", "Lateral_Triceps_Stretch", "Latissimus_Dorsi_Stretch", "Leg_Extensions", "Leg_Lift", "Leg_Press", "Leg_Pull_In", "Leg_Raise", "Levee_Plank", "Lever_Chest_Press", "Lever_Deadlift", "Lever_Front_Squat", "Lever_Lying_Leg_Curl", "Lever_Seated_Calf_Raise", "Lever_Seated_Crunch", "Lever_Seated_Hip_Adduction", "Lever_Seated_Hip_Abduction", "Lever_Seated_Leg_Curl", "Lever_Shoulder_Press", "Lever_Standing_Calf_Raise", "Lever_Triceps_Extension", "Linear_3-Part_Start_Technique", "Log_Lift", "Lying_Cable_Curl", "Lying_Cable_Row", "Lying_Cambered_Bar_Row", "Lying_Dumbbell_Curl", "Lying_Dumbbell_Triceps_Extension", "Lying_Face_Down_Plate_Neck_Resistance", "Lying_Face_Up_Plate_Neck_Resistance", "Lying_Hamstring", "Lying_Leg_Curl", "Lying_Machine_Squat", "Lying_One-Arm_Lateral_Raise", "Lying_Prone_Triceps_Extension", "Lying_Reach_Stretch", "Lying_Triceps_Press", "Machine_Bench_Press", "Machine_Bicep_Curl", "Machine_Chest_Fly", "Machine_Hammer_Curls", "Machine_Hip_Abduction", "Machine_Hip_Adduction", "Machine_Incline_Bench_Press", "Machine_Lateral_Raise", "Machine_Preacher_Curls", "Machine_Seated_Crunch", "Machine_Shoulder_Press", "Machine_Triceps_Extension", "Medicine_Ball_Chest_Pass", "Medicine_Ball_Chops", "Medicine_Ball_Clean", "Medicine_Ball_Overhead_Slam", "Medicine_Ball_Push-Up", "Medicine_Ball_Russian_Twist", "Medicine_Ball_ Slam", "Medicine_Ball_Scoop_Throw", "Medicine_Ball_Woodchops", "Mixed_Grip_Chin", "Modified_Pull-Up", "Monster_Walk", "Mountain_Climbers", "Muscle-Up", "Neck_Press", "Neck_SMR", "Negative_Chin-Up", "Negative_Pull-Up", "Oblique_Crunches", "Oblique_Crunches_On_The_Floor", "One-Arm_Medicine_Ball_Slam", "One-Arm_Pull-Up", "One_Against_Two", "One_Arm_Barbell_Row", "One_Arm_Concentration_Curl", "One_Arm_Dumbbell_Row", "One_Arm_Dumbbell_Triceps_Extension", "One_Arm_Floor_Press", "One_Arm_Kettlebell_Press", "One_Arm_Kettlebell_Swing", "One_Arm_Lateral_Raise", "One_Arm_Long_Bar_Row", "One_Arm_Overhead_Kettlebell_Squat", "One_Arm_Smith_Machine_Press", "One_Arm_Supinated_Row", "One_Knee_To_Chest_Stretch", "One_Leg_Barbell_Squat", "One_Leg_Kickback", "Otis_Up", "Overhead_Cable_Curl", "Overhead_Triceps", "Overhead_Triceps_Stretch", "Palms-Down_Dumbbell_Wrist_Curl_Over_A_Bench", "Palms-Up_Barbell_Wrist_Curl_Over_A_Bench", "Palms-Up_Dumbbell_Wrist_Curl_Over_A_Bench", "Parallel_Bar_Dip", "Pelvic_Tilt_Into_Bridge", "Pelvic_Tilt_With_Stability_Ball", "Pendlay_Row", "Pigeon_Stretch", "Pike_Push-Up", "Pike_Push-Up_On_Bench", "Pistol_Squat", "Plank", "Plank_With_Leg_Raise", "Plate_Pinch", "Plie_Dumbbell_Squat", "Pot_Dealer_Squat", "Power_Clean", "Power_Clean_from_Blocks", "Power_Conductor", "Power_Floor_Triceps_Extension", "Power_Jerk", "Power_Partial", "Power_Snatch", "Power_Snatch_from_Blocks", "Power_Stairs", "Preacher_Curl", "Pressure_Release_Stretch", "Prone_Incline_Cable_Curl", "Pull_Through", "Pull-Up", "Pull-Up_Wide_Neutral_Grip", "Punches", "Push_Jerk", "Push-Press", "Push-Up", "Push-Up_-_Close_Triceps_Position", "Push-Up_Wide", "Push-Ups_-_With_Bands", "Push_Ups_Against_Chair", "Pushing_Stretch", "Rack_Delivery", "Rack_Lunges", "Rack_Pull", "Rear_Delt_Fly", "Rear_Lateral_Raise", "Rear_Leg_Raises", "Recumbent_Bike", "Regular_Deadlift", "Reverse_Barbell_Curl", "Reverse_Barbell_Press", "Reverse_Bench_Press", "Reverse_Bicep_Curl", "Reverse_Cable_Curl", "Reverse_Crunch", "Reverse_Dumbbell_Press", "Reverse_Flyes", "Reverse_Grip_Barbell_Triceps_Extension", "Reverse_Grip_Dumbbell_Press", "Reverse_Grip_Triceps_Pushdown", "Reverse_Hyperextension", "Reverse_Plate_Curl", "Reverse_Triceps_Bench_Press", "Rhomboid_Stretch", "Rickshaw_Carry", "Rickshaw_Deadlift", "Rope_Climb", "Rope_Jumping", "Rope_Pushdown", "Rope_Rise_Triceps_Extension", "Rotation_Mobility_Exercise", "Round_The_World_Pull", "Rowing,_Stationary", "Runner's_Stretch", "Running,_Treadmill", "Russian_Twist", "Scapular_Pull-Up", "Scissor_Kick", "Seated_Barbell_Military_Press", "Seated_Barbell_Twist", "Seated_Bench_Pull", "Seated_Bent-Over_Rear_Delt_Raise", "Seated_Cable_Crunches", "Seated_Cable_Row", "Seated_Cable_Shoulder_Press", "Seated_Calf_Raise", "Seated_Close-Grip_Concentration_Barbell_Curl", "Seated_Concentration_Curl", "Seated_Dumbbell_Curl", "Seated_Dumbbell_Press", "Seated_Flat_Bench_Leg_Pull-In", "Seated_Floor_Hamstring_Stretch", "Seated_Front_Deltoid", "Seated_Glute_Stretch", "Seated_Good_Mornings", "Seated_Head_Harness_Neck_Resistance", "Seated_Leg_Curl", "Seated_Leg_Press", "Seated_Leg_Raise", "Seated_Lower_Back", "Seated_One-Arm_Cable_Row", "Seated_One-Arm_Dumbbell_Palm-In_Triceps_Extension", "Seated_One-Arm_Dumbbell_Triceps_Extension", "Seated_One-Arm_Kettlebell_Triceps_Extension", "Seated_Overhead_Triceps_Extension", "Seated_Palms-Down_Barbell_Wrist_Curl", "Seated_Palms-Up_Barbell_Wrist_Curl", "Seated_Pullover", "Seated_Row", "Seated_Side_Lateral_Raise", "Seated_Triceps_Press", "Seated_Two-Arm_Palms-Up_Dumbbell_Wrist_Curl", "Seated_Two-Arm_Supinated_Dumbbell_Wrist_Curl", "Serratus_Chair_Push-Up", "Shin_Stretch", "Shoulder_Circles", "Shoulder_Stretch", "Shrug", "Side_Bridge_Hip_Abduction", "Side_Hop", "Side_Lateral_Raise", "Side_Leg_Raises", "Side_Neck_Stretch", "Side_Plank", "Side_Push-Up", "Side_Push_Neck_Stretch", "Side_Standing_Lateral_Jump", "Side_To_Side_Chins", "Side_Wrist_Pull", "Single-Arm_Cable_Chest_Press", "Single-Arm_Cable_Crossover", "Single-Arm_Dumbbell_Overhead_Triceps_Extension", "Single-Arm_Dumbbell_Triceps_Extension", "Single-Arm_Push-Up", "Single-Leg_Glute_Bridge", "Single-Leg_Hip_Thrust", "Single-Leg_Jump_Squat", "Single-Leg_Stride_Standing", "Single_Leg_Box_Jump", "Single_Leg_Calf_Raise", "Single_Leg_Floor_Press", "Single_Leg_Glute_Bridge_With_Knee_Hug", "Single_Leg_Hamstring_Curl", "Single_Leg_Leg_Press", "Single_Leg_Push-Up", "Sit-Up", "Sit-Up_Version_2", "Sledge_Hammer", "Sled_Reverse_Fly", "Smith_Machine_Bench_Press", "Smith_Machine_Deadlift", "Smith_Machine_Hip_Raise", "Smith_Machine_Incline_Bench_Press", "Smith_Machine_Leg_Press", "Smith_Machine_Overhead_Shoulder_Press", "Smith_Machine_Squat", "Smith_Machine_Stiff-Legged_Deadlift", "Smith_Machine_Wide_Grip_Seated_Row", "Snatch", "Snatch_Deadlift", "Snatch_Pull", "Snatch_Shrug", "Speed_Band_Overhead_Triceps", "Speed_Box_Jump", "Speed_Skater", "Speed_Squat", "Spell_Caster", "Sphinx", "Spider_Crawl", "Spider_Curl", "Spinal_Stretch", "Split_Jump", "Split_Snatch", "Split_Squat", "Split_Squat_With_Dumbbells", "Squat_Jump", "Squat_With_Plate_Alternating_Reach", "Standing_Alternating_Dumbbell_Press", "Standing_Alternating_Hammer_Curl", "Standing_Alternating_Triceps_Extension", "Standing_Barbell_Calf_Raise", "Standing_Barbell_Press_Behind_Neck", "Standing_Bent-Over_One-Arm_Dumbbell_Triceps_Extension", "Standing_Bent-Over_Two-Arm_Dumbbell_Triceps_Extension", "Standing_Bicep_Curl", "Standing_Cable_Chest_Press", "Standing_Cable_Crossover", "Standing_Cable_Curl", "Standing_Cable_Lateral_Raise", "Standing_Cable_Row", "Standing_Cable_Triceps_Extension", "Standing_Calf_Raise", "Standing_Concentration_Curl", "Standing_Crunch", "Standing_Dumbbell_Calf_Raise", "Standing_Dumbbell_Press", "Standing_Dumbbell_Reverse_Curl", "Standing_Dumbbell_Triceps_Extension", "Standing_Dumbbell_Upright_Row", "Standing_External_Shoulder_Rotation", "Standing_Front_Raise_Above_Head", "Standing_Gastrocnemius_Calf_Stretch", "Standing_Hamstring_Stretch", "Standing_Hip_Circles", "Standing_Hip_Stretch", "Standing_Inner_Biceps_Curl", "Standing_Internal_Shoulder_Rotation", "Standing_Lateral_Stretch", "Standing_Leg_Curl", "Standing_Long_Jump", "Standing_Low-Pulley_Deltoid_Raise", "Standing_Low-Pulley_One-Arm_Triceps_Extension", "Standing_Military_Press", "Standing_One-Arm_Cable_Curl", "Standing_One-Arm_Dumbbell_Curl_Over_Incline_Bench", "Standing_One-Arm_Dumbbell_Triceps_Extension", "Standing_One-Arm_Triceps_Extension", "Standing_Overhead_Barbell_Triceps_Extension", "Standing_Palms-In_Dumbbell_Press", "Standing_Palms-Up_Dumbbell_Bench_Press", "Standing_Pelvic_Tilt", "Standing_Rope_Crunch", "Standing_Row", "Standing_To_Rowing_Punch", "Standing_Two-Arm_Overhead_Throw", "Standing_Wheel_Rollerout", "Star_Jump", "Step_Mill", "Step-ups", "Step-ups_With_Knee_Raise", "Stiff-Legged_Barbell_Deadlift", "Stomach_Stretch", "Stone_Lift", "Straight-Arm_Pulldown", "Straight_Leg_Deadlift", "Straight_Raises_On_Incline_Bench", "Stride_Jump_Cross", "Sumo_Deadlift", "Sumo_Deadlift_with_Bands", "Superman", "Supine_Chest_Throw", "Supine_One-Arm_Overhead_Throw", "Supine_Two-Arm_Overhead_Throw", "Svend_Press", "Swimmer_Kicks", "Swing_360", "Table_Top_Knee_Lifts", "Tate_Press", "The_Straddle_Stretch", "Thigh_Adductor", "Thigh_Circles", "Thigh_Stretch", "Thoracic_Extension_On_Foam_Roller", "Thruster", "Tire_Flip", "Toe_Touchers", "Torso_Rotation", "Towel_Triceps_Pushdown", "Trap_Bar_Deadlift", "Tree_Hugger", "Tricep_Dumbbell_Kickback", "Tricep_Pushdown", "Triceps_Extension", "Triceps_Overhead_Extension_with_a_Rope", "Triceps_Stretch", "Triceps_Pushdown_-_V-Bar_Attachment", "Triceps_Stretch_Against_Wall", "Tuck_Crunch", "Turkish_Get-Up", "Twisted_Sit-Up", "Two-Arm_Dumbbell_Press", "Two-Arm_Dumbbell_Triceps_Extension", "Two-Arm_Kettlebell_Triceps_Extension", "Underhand_Cable_Pulldown", "Underhand_Lat_Pulldown", "Upper_Back_Leg_Stretch", "Upper_Back_Stretch", "Upright_Cable_Row", "Upright_Row_-_With_Bands", "V-Bar_Pulldown", "Vertical_Swing", "Walking_High_Knee", "Walking_Lunge", "Wall_Ball", "Wall_Plank_Walk", "Wide_Grip_Lat_Pulldown", "Wide_Grip_Push-Up", "Wind_Sprint", "Windmill", "World's_Greatest_Stretch", "Wrist_Circles", "Wrist_Roller", "Wrist_Stretch", "Yates_Row", "Zercher_Squat",
];

const freeDbSet = new Set(freeDbDirs.map(d => d.replace(/['']/g, '')));

function normalizeName(name: string): string {
  const cleaned = name.replace(/\s*\(.*?\)\s*/g, '').trim();
  return toSnake(cleaned);
}

// Score how well a name matches a free-exercise-db directory
function matchScore(name: string, dbDir: string): number {
  const a = name.replace(/['']/g, '').toLowerCase();
  const b = dbDir.replace(/['']/g, '').toLowerCase();
  const nameWords = toSnake(a).split('_').filter(w => w.length > 2);
  const dbWords = toSnake(b).split('_').filter(w => w.length > 2);
  if (nameWords.length === 0 || dbWords.length === 0) return 0;
  const overlap = nameWords.filter(w => dbWords.includes(w)).length;
  const longer = Math.max(nameWords.length, dbWords.length);
  return overlap / longer;
}

export function getExerciseGif(name: string): string | undefined {
  const direct = exerciseGifs[name];
  if (direct) return direct;
  return exerciseGifs[normalizeName(name)];
}

export function getExerciseImage(name: string): string | undefined {
  const normal = normalizeName(name);

  if (freeDbSet.has(normal)) {
    return `${imageBase}/${normal}/0.jpg`;
  }

  // Fuzzy match against free-exercise-db directories
  let bestDir = '';
  let bestScore = 0;
  for (const dir of freeDbDirs) {
    const score = matchScore(name, dir);
    if (score > bestScore) {
      bestScore = score;
      bestDir = dir;
    }
  }

  if (bestScore >= 0.5) {
    return `${imageBase}/${bestDir}/0.jpg`;
  }

  if (bestScore >= 0.4) {
    return `${imageBase}/${bestDir}/0.jpg`;
  }

  return undefined;
}
