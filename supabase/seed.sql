insert into public.cities (name, state, slug, lat, lng) values
('Phoenix','AZ','phoenix',33.4484,-112.0740),
('San Diego','CA','san-diego',32.7157,-117.1611)
on conflict (slug) do nothing;

insert into public.leagues (city_id, name, website, fees, season_start, season_end, divisions, nights, signup_url, verified, verified_by)
select id, 'Phoenix NFL FLAG', 'https://example.com/phx-nfl-flag', 175.00, '2026-02-15','2026-05-10',
       array['6U','8U','10U','12U'], array['Sat','Sun'], 'https://example.com/signup', true, 'Taylor'
from public.cities where slug='phoenix';

insert into public.leagues (city_id, name, website, fees, divisions, nights, signup_url, verified, verified_by)
select id, 'San Diego Youth Flag', 'https://example.com/sd-youth', 185.00,
       array['8U','10U','12U','14U'], array['Mon','Wed'], 'https://example.com/sd-signup', true, 'Taylor'
from public.cities where slug='san-diego';
