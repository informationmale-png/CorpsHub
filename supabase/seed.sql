-- CorpsHub demo seed — run ONCE in Supabase → SQL Editor.
-- Creates 3 demo fellows + 6 example projects + reviews + deployments so the
-- homepage, library, project pages, fellow profiles, and Impact Dashboard look alive.
-- Idempotent: re-running is safe (on conflict do nothing / fixed UUIDs).

-- 1) Demo fellow accounts (display-only; can't log in). Trigger auto-creates their profiles.
insert into auth.users
  (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
   created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
   confirmation_token, email_change, email_change_token_new, recovery_token)
values
  ('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000001','authenticated','authenticated','maya.demo@corpshub.example','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"full_name":"Maya Chen"}','','','',''),
  ('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000002','authenticated','authenticated','devon.demo@corpshub.example','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"full_name":"Devon Park"}','','','',''),
  ('00000000-0000-0000-0000-000000000000','a0000000-0000-0000-0000-000000000003','authenticated','authenticated','aisha.demo@corpshub.example','',now(),now(),now(),'{"provider":"email","providers":["email"]}','{"full_name":"Aisha Rahman"}','','','','')
on conflict (id) do nothing;

-- 2) Flesh out their profiles.
update profiles set cohort='1', host_org='Greater Boston Food Bank', sector='Food Security',
  bio='Built data + reporting tools for food security orgs across New England during my fellowship year.'
  where id='a0000000-0000-0000-0000-000000000001';
update profiles set cohort='1', host_org='Veterans Outreach Center', sector='Veterans',
  bio='Focused on case management and benefits navigation for veterans services.'
  where id='a0000000-0000-0000-0000-000000000002';
update profiles set cohort='1', host_org='New Horizons Refugee Services', sector='Immigration',
  bio='Worked on multilingual intake and case documentation for refugee resettlement.'
  where id='a0000000-0000-0000-0000-000000000003';

-- 3) Example projects (fixed UUIDs so reviews/deployments can reference them).
insert into projects (id, author_id, name, one_liner, problem, solution, setup_needs, setup_time, difficulty, sector, org_size, note_to_next, github_url, verified, created_at) values
('00000000-0000-0000-0000-0000000000f1','a0000000-0000-0000-0000-000000000001',
 'Food Bank Intake Reporter',
 'Turns three messy spreadsheets into one Monday-morning follow-up list, automatically.',
 'Every Monday, three staff members spent four hours pulling client data from three different spreadsheets to figure out who needed a follow-up call. People slipped through the cracks, and the staff dreaded Mondays.',
 'Now at 8am every Monday, a clean report lands in the director''s inbox: exactly who needs a follow-up call this week and why. No spreadsheets, no manual cross-checking.',
 'A Google account, view access to your intake spreadsheets, and about 2 hours with a fellow. No coding needed.',
 'Under 1 day','Beginner','Food Security','Medium',
 'The only fiddly part is Google Sheets share permissions — budget 30 minutes for that. Everything after is smooth.',
 '', true, now() - interval '2 days'),

('00000000-0000-0000-0000-0000000000f2','a0000000-0000-0000-0000-000000000001',
 'Pantry Inventory Forecaster',
 'Predicts which items will run short next week so you order before you run out.',
 'The pantry kept running out of staples mid-week and over-ordering things that sat on shelves. Ordering was guesswork based on whoever was on shift.',
 'It reads your inventory log and weekly distribution, then flags what''s likely to run short in the next 7 days with a suggested order quantity.',
 'Your inventory tracked in a spreadsheet, and a fellow for half a day to connect it.',
 '1-3 days','Intermediate','Food Security','Medium',
 'Works best with at least a month of past inventory data — the more history, the better the forecast.',
 '', false, now() - interval '5 days'),

('00000000-0000-0000-0000-0000000000f3','a0000000-0000-0000-0000-000000000002',
 'Veteran Follow-Up Tracker',
 'Makes sure no veteran waiting on a callback gets forgotten.',
 'Case managers tracked follow-ups on sticky notes and memory. With 60+ open cases each, veterans waiting on benefits help would go weeks without contact.',
 'A simple dashboard shows each case manager exactly who they owe a callback, sorted by how long it''s been. Overdue cases turn red. Nothing gets lost.',
 'Access to your case management system (or a shared sheet) and an afternoon with a fellow.',
 'Under 1 day','Beginner','Veterans','Small',
 'If your case system can export to CSV, this is a one-afternoon setup. If not, plan a bit more.',
 '', true, now() - interval '1 day'),

('00000000-0000-0000-0000-0000000000f4','a0000000-0000-0000-0000-000000000002',
 'Benefits Eligibility Assistant',
 'Answers "which benefits is this veteran eligible for?" in plain language, in seconds.',
 'Figuring out eligibility across VA programs meant flipping through PDFs and calling around. New staff took months to get confident, and veterans got inconsistent answers.',
 'Staff describe the veteran''s situation in plain English and get back the likely programs, what''s needed to apply, and where to start — grounded in current eligibility rules.',
 'Reviewed eligibility docs for your programs and a week with a fellow to set up and verify.',
 '1 week+','Advanced','Veterans','Large',
 'Have a benefits expert review the first 20 answers before going live — accuracy here matters a lot.',
 '', false, now() - interval '8 days'),

('00000000-0000-0000-0000-0000000000f5','a0000000-0000-0000-0000-000000000003',
 'Refugee Case Note Summarizer',
 'Turns scattered case notes into a clean, shareable client summary in one click.',
 'Case files were a wall of dated notes. When a client got handed to a new caseworker — or to a partner org — bringing them up to speed took an hour of reading.',
 'Pulls a client''s notes into a structured summary: current status, open needs, key dates, and next steps. New caseworkers get oriented in two minutes.',
 'Your case notes in a shared doc or system, and a fellow for a day or two.',
 '1-3 days','Intermediate','Immigration','Medium',
 'Keep client data in your own system — this reads it, it doesn''t store it. Talk to your privacy lead first.',
 '', false, now() - interval '4 days'),

('00000000-0000-0000-0000-0000000000f6','a0000000-0000-0000-0000-000000000003',
 'Multilingual Intake Form Helper',
 'Lets clients complete intake in their own language; staff get it back in English.',
 'Intake stalled when clients didn''t share a language with the front desk. Appointments got rebooked, and people gave up before they got help.',
 'Clients fill out intake in their language; staff see a clean English version instantly, with the original kept alongside. Fewer rebookings, faster help.',
 'Your intake questions and an afternoon with a fellow. No new software for clients.',
 'Under 1 day','Beginner','Immigration','Small',
 'Test with the 3-4 languages your clients actually use most — don''t try to cover everything on day one.',
 '', false, now() - interval '6 days')
on conflict (id) do nothing;

-- 4) Reviews (social proof on project pages).
insert into reviews (id, project_id, author_name, org_name, rating, body, created_at) values
('00000000-0000-0000-0000-0000000000e1','00000000-0000-0000-0000-0000000000f1','Maria Reyes','West Side Food Pantry (Cleveland, OH)',5,'We deployed this at our pantry and it took one afternoon. Our intake coordinator saves about 6 hours a week now. Clients barely notice a change, but our staff is so much less stressed.',now() - interval '1 day'),
('00000000-0000-0000-0000-0000000000e2','00000000-0000-0000-0000-0000000000f1','James Okafor','Hope Harvest (Austin, TX)',5,'The Monday report is the first thing our director opens now. Genuinely changed how we run follow-ups.',now() - interval '3 hours'),
('00000000-0000-0000-0000-0000000000e3','00000000-0000-0000-0000-0000000000f3','Linda Tran','Veterans Bridge (San Diego, CA)',5,'No more sticky notes. We caught three overdue cases in the first week that would have slipped.',now() - interval '2 days'),
('00000000-0000-0000-0000-0000000000e4','00000000-0000-0000-0000-0000000000f5','Samuel Beck','Riverside Resettlement (Chicago, IL)',4,'Huge time saver for handoffs. Took a little tuning to match our note format, but worth it.',now() - interval '12 hours')
on conflict (id) do nothing;

-- 5) Deployments (powers Trending + Impact Dashboard numbers).
insert into deployments (id, project_id, org_name, state, hours_saved, created_at) values
('00000000-0000-0000-0000-0000000000d1','00000000-0000-0000-0000-0000000000f1','West Side Food Pantry','OH',312,now() - interval '20 days'),
('00000000-0000-0000-0000-0000000000d2','00000000-0000-0000-0000-0000000000f1','Hope Harvest','TX',180,now() - interval '14 days'),
('00000000-0000-0000-0000-0000000000d3','00000000-0000-0000-0000-0000000000f1','Lakeside Food Project','MI',96,now() - interval '6 days'),
('00000000-0000-0000-0000-0000000000d4','00000000-0000-0000-0000-0000000000f3','Veterans Bridge','CA',240,now() - interval '11 days'),
('00000000-0000-0000-0000-0000000000d5','00000000-0000-0000-0000-0000000000f3','Valor Outreach','GA',150,now() - interval '7 days'),
('00000000-0000-0000-0000-0000000000d6','00000000-0000-0000-0000-0000000000f5','Riverside Resettlement','IL',128,now() - interval '9 days'),
('00000000-0000-0000-0000-0000000000d7','00000000-0000-0000-0000-0000000000f2','Greater Boston Food Bank','MA',60,now() - interval '3 days'),
('00000000-0000-0000-0000-0000000000d8','00000000-0000-0000-0000-0000000000f6','New Horizons Refugee Services','MA',72,now() - interval '5 days')
on conflict (id) do nothing;
