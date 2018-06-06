INSERT INTO nonprofits
(
    company_name,
    street_address,
    city,
    state,
    zip_code,
    phone_number,
    latitude,
    longitude,
    business_type,
    admin_first_name,
    admin_last_name,
    fein
)
VALUES
(
    $1,
    $2,
    $3,
    $4,
    $5,
    $6,
    $7,
    $8,
    $9,
    $10,
    $11,
    $12
)
RETURNING *;