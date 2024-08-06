<?php
require_once "global.php";
header('Content-Type: application/json');
class Get extends GlobalMethods
{
    private $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function executeQuery($sql)
    {
        $data = array(); //place to store records retrieved for db
        $errmsg = ""; //initialized error message variable
        $code = 0; //initialize status code variable

        try {
            if ($result = $this->pdo->query($sql)->fetchAll()) { //retrieved records from db, returns false if no records found
                foreach ($result as $record) {
                    array_push($data, $record);
                }
                $code = 200;
                $result = null;
                return array("code" => $code, "data" => $data);
            } else {
                //if no record found, assign corresponding values to error messages/status
                $errmsg = "No records found";
                $code = 404;
            }
        } catch (\PDOException $e) {
            //PDO errors, mysql errors
            $errmsg = $e->getMessage();
            $code = 403;
        }
        return array("code" => $code, "errmsg" => $errmsg);
    }

    public function get_records($table, $condition = null)
    {
        $sqlString = "SELECT * FROM $table";
        if ($condition != null) {
            $sqlString .= " WHERE " . $condition;
        }

        $result = $this->executeQuery($sqlString);

        if ($result['code'] == 200) {
            return $this->sendPayload($result['data'], "success", "Successfully retrieved records.", $result['code']);
        }

        return $this->sendPayload(null, "failed", "Failed to retrieve records.", $result['code']);
    }


    public function view_user_blogs($data)
    {
        // Check if the 'id' key exists in the data array and retrieve it
        $id = $data['id'] ?? null; // Using null coalescing operator for default value
        if ($id === null) {
            // Handle case where $id is not provided
            return array(
                "error" => "Error: User ID is required"
            );
        }
    
        try {
            $userData = [];
    
            // Query for 'users' data
            $sql_userinfo = "SELECT * FROM users WHERE userID = :id LIMIT 1";
            $stmt_userinfo = $this->pdo->prepare($sql_userinfo);
            $stmt_userinfo->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt_userinfo->execute();
            $userData['user'] = $stmt_userinfo->fetch(PDO::FETCH_ASSOC);
    
            // Query for blogs data
            $sql_blogs = "SELECT * FROM blogs WHERE userID = :id";
            $stmt_blogs = $this->pdo->prepare($sql_blogs);
            $stmt_blogs->bindParam(':id', $id, PDO::PARAM_INT);
            $stmt_blogs->execute();
            $blogs = $stmt_blogs->fetchAll(PDO::FETCH_ASSOC);
    
            // Add blogs to user data
            $userData['blogs'] = $blogs;
    
            // Return the user data
            return $userData;
        } catch (\PDOException $e) {
            // Handle database errors
            return array("error" => "Error: " . $e->getMessage());
        }
    }


    public function view_user_blog($data)
{
    // Check if the 'blogID' key exists in the data array and retrieve it
    $blogID = $data['blogID'] ?? null; // Using null coalescing operator for default value
    if ($blogID === null) {
        // Handle case where $blogID is not provided
        return array(
            "error" => "Error: Blog ID is required"
        );
    }

    try {
        $blogData = [];

        // Query for specific blog data
        $sql_blog = "SELECT * FROM blogs WHERE blogID = :blogID LIMIT 1";
        $stmt_blog = $this->pdo->prepare($sql_blog);
        $stmt_blog->bindParam(':blogID', $blogID, PDO::PARAM_INT);
        $stmt_blog->execute();
        $blog = $stmt_blog->fetch(PDO::FETCH_ASSOC);

        // Check if blog exists
        if (!$blog) {
            return array(
                "error" => "Error: Blog not found"
            );
        }

        // Return the blog data
        return $blog;
    } catch (\PDOException $e) {
        // Handle database errors
        return array("error" => "Error: " . $e->getMessage());
    }
}

    


// public function get_gallery($data){

// }


// public function view_user_images($data)
// {
//     // Check if the 'id' key exists in the data array and retrieve it
//     $id = $data['id'] ?? null; // Using null coalescing operator for default value
//     if ($id === null) {
//         // Handle case where $id is not provided
//         return array(
//             "error" => "Error: User ID is required"
//         );
//     }

//     try {

//         $userData = [];

//         // Query for 'users' data
//         $sql_userinfo = "SELECT * FROM users WHERE userID = :id LIMIT 1";
//         $stmt_userinfo = $this->pdo->prepare($sql_userinfo);
//         $stmt_userinfo->bindParam(':id', $id, PDO::PARAM_INT);
//         $stmt_userinfo->execute();
//         $userData['user'] = $stmt_userinfo->fetch(PDO::FETCH_ASSOC);

//         $sql_images = "SELECT * FROM image WHERE userID = :id";
//         $stmt_images = $this->pdo->prepare($sql_images);
//         $stmt_images->bindParam(':id', $id, PDO::PARAM_INT);
//         $stmt_images->execute();
//         $images = $stmt_images->fetchAll(PDO::FETCH_ASSOC);

//         // Construct full image paths
//         $uploadDirectory = "/files/projects/";
//         $userData['images'] = array_map(function($image) use ($uploadDirectory) {
//             $image['img'] = $uploadDirectory . $image['img'];
//             return $image;
//         }, $images);

//         // Return the user data
//         return $userData;
//     } catch (\PDOException $e) {
//         // Handle database errors
//         return "Error: " . $e->getMessage();
//     }
// }


// public function view_user_images($data)
// {
//     $id = $data['id'] ?? null;
//     if ($id === null) {
//         return array("error" => "Error: User ID is required");
//     }

//     try {
//         $userData = [];

//         $sql_userinfo = "SELECT * FROM users WHERE userID = :id LIMIT 1";
//         $stmt_userinfo = $this->pdo->prepare($sql_userinfo);
//         $stmt_userinfo->bindParam(':id', $id, PDO::PARAM_INT);
//         $stmt_userinfo->execute();
//         $userData['user'] = $stmt_userinfo->fetch(PDO::FETCH_ASSOC);

//         $sql_images = "SELECT * FROM image WHERE userID = :id";
//         $stmt_images = $this->pdo->prepare($sql_images);
//         $stmt_images->bindParam(':id', $id, PDO::PARAM_INT);
//         $stmt_images->execute();
//         $images = $stmt_images->fetchAll(PDO::FETCH_ASSOC);

//         $uploadDirectory = "/files/projects/";
//         $userData['images'] = array_map(function($image) use ($uploadDirectory) {
//             $image['img'] = $uploadDirectory . $image['img'];
//             return $image;
//         }, $images);

//         return $userData;
//     } catch (\PDOException $e) {
//         return "Error: " . $e->getMessage();
//     }
// }


// public function get_all_images()
// {
//     $sql = "SELECT i.imgID, 
//                    i.img, 
//                    i.imgDesc, 
//                    i.userID, 
//                    i.timeStamp AS imgTimeStamp,
//                    u.username,
//                    GROUP_CONCAT(DISTINCT c.commentText ORDER BY c.commentID) AS comments,
//                    GROUP_CONCAT(DISTINCT c.timestamp ORDER BY c.commentID) AS commentTimeStamps
//             FROM image i
//             LEFT JOIN users u ON i.userID = u.userID
//             LEFT JOIN comments c ON i.imgID = c.imgID
//             GROUP BY i.imgID, i.img, i.imgDesc, i.userID, i.timeStamp, u.username
//             ORDER BY i.timeStamp DESC";
//     $stmt = $this->pdo->prepare($sql);
//     $stmt->execute();
//     $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

//     foreach ($images as &$image) {
//         // Convert comma-separated comments and comment timestamps into arrays
//         $image['comments'] = $image['comments'] ? explode(',', $image['comments']) : [];
//         $image['commentTimeStamps'] = $image['commentTimeStamps'] ? explode(',', $image['commentTimeStamps']) : [];
//     }

//     return $images;
// }

// public function get_all_images()
// {
//     $sql = "SELECT i.imgID, 
//                    i.img, 
//                    i.imgDesc, 
//                    i.userID, 
//                    i.timeStamp AS imgTimeStamp,
//                    u.username AS uploaderUsername,
//                    GROUP_CONCAT(DISTINCT c.commentText ORDER BY c.commentID) AS comments,
//                    GROUP_CONCAT(DISTINCT c.timestamp ORDER BY c.commentID) AS commentTimeStamps,
//                    GROUP_CONCAT(DISTINCT cu.username ORDER BY c.commentID) AS commenterUsernames
//             FROM image i
//             LEFT JOIN users u ON i.userID = u.userID
//             LEFT JOIN comments c ON i.imgID = c.imgID
//             LEFT JOIN users cu ON c.userID = cu.userID
//             GROUP BY i.imgID, i.img, i.imgDesc, i.userID, i.timeStamp, u.username
//             ORDER BY i.timeStamp DESC";
//     $stmt = $this->pdo->prepare($sql);
//     $stmt->execute();
//     $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

//     foreach ($images as &$image) {
//         // Convert comma-separated comments, comment timestamps, and commenter usernames into arrays
//         $image['comments'] = $image['comments'] ? explode(',', $image['comments']) : [];
//         $image['commentTimeStamps'] = $image['commentTimeStamps'] ? explode(',', $image['commentTimeStamps']) : [];
//         $image['commenterUsernames'] = $image['commenterUsernames'] ? explode(',', $image['commenterUsernames']) : [];
//     }

//     return $images;
// }

public function get_all_images()
{
    $sql = "SELECT i.imgID, 
                   i.img, 
                   i.imgDesc, 
                   i.userID, 
                   i.timeStamp AS imgTimeStamp,
                   u.username AS uploaderUsername,
                   GROUP_CONCAT(DISTINCT c.commentText ORDER BY c.commentID) AS comments,
                   GROUP_CONCAT(DISTINCT c.timestamp ORDER BY c.commentID) AS commentTimeStamps,
                   GROUP_CONCAT(DISTINCT cu.username ORDER BY c.commentID) AS commenterUsernames
            FROM image i
            LEFT JOIN users u ON i.userID = u.userID
            LEFT JOIN comments c ON i.imgID = c.imgID
            LEFT JOIN users cu ON c.userID = cu.userID
            GROUP BY i.imgID, i.img, i.imgDesc, i.userID, i.timeStamp, u.username
            ORDER BY i.timeStamp DESC";
    $stmt = $this->pdo->prepare($sql);
    $stmt->execute();
    $images = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($images as &$image) {
        // Convert comma-separated comments, comment timestamps, and commenter usernames into arrays
        $image['comments'] = $image['comments'] ? explode(',', $image['comments']) : [];
        $image['commentTimeStamps'] = $image['commentTimeStamps'] ? explode(',', $image['commentTimeStamps']) : [];
        $image['commenterUsernames'] = $image['commenterUsernames'] ? explode(',', $image['commenterUsernames']) : [];
    }

    return $images;
}




}
