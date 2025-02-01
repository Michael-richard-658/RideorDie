use rideordie;




alter user 'root'@'localhost' identified with mysql_native_password by 'Richard658958!';

create table users(
id int not	 null auto_increment primary key,
user_id varchar(255) not null unique,
username varchar(255) not null ,
email varchar(255) not null unique,
password varchar(100) not null,
experience varchar(20) NOT NULL,
ridingpreference varchar(30) NOT NULL,
joined_at timestamp default now());


select * from users;

desc users;

drop table users;

select password,experience,ridingpreference from users where user_id="${user.id}";


CREATE TABLE IF NOT EXISTS solo_ride (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    ride_url varchar(500) not null,
    ride_date DATE NOT NULL,
    time TIME NOT NULL,
    distance VARCHAR(50) NOT NULL,
    duration int NOT NULL,
    rider_name VARCHAR(255) NOT NULL,
    experience_level varchar(20) NOT NULL,
    tags varchar(255) NOT NULL,
    note TEXT,
    user_id varchar(40) ,
    created_at timestamp default now(),
    foreign key(user_id) references users(user_id)
);


create table feedback(
id int not null auto_increment primary key,
statement text,
user_id varchar(40) not null,
created_at  timestamp default now(),
foreign key(user_id) references users(user_id)
);
drop table solo_ride;
select * from feedback;

select statement,username,users.user_id,dayname(feedback.created_at) from users join feedback on
	users.user_id=feedback.user_id;

select * from users join solo_ride on
users.user_id=solo_ride.user_id;

select * from solo_ride;

desc solo_ride;

drop table solo_ride;




CREATE TABLE followers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    follower_id varchar(50) NOT NULL,
    following_id varchar(50)  NOT NULL,
    followed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (follower_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (following_id) REFERENCES users(user_id) ON DELETE CASCADE,
    
    
    UNIQUE (follower_id, following_id)
);

select * from followers join users on 
users.user_id=followers.follower_id;

SELECT  count(u.user_id) as followers
FROM followers f
JOIN users u ON u.user_id = f.follower_id
WHERE f.following_id = '7c8b004f-bbca-4a42-98c4-d5c7128b2596';

SELECT  count(u.user_id) as following
FROM followers f
JOIN users u ON u.user_id = f.following_id
WHERE f.follower_id = '21567ca4-a46a-4559-8d66-e35c3648fd27';

SELECT u.username, COUNT(f.follower_id) AS followers
FROM followers f
JOIN users u ON u.user_id = f.follower_id
WHERE f.following_id = 'dc64bef0-17af-4da4-98f2-cf39e573981e'
GROUP BY u.username;