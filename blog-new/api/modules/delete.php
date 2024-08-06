<?php

require_once 'global.php';

class Delete extends GlobalMethods
{
    private $pdo;

    public function __construct(\PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function deleteRecord($table, $id)
    {
        try {
            $sql = "blogs $table WHERE blogID = :blogID";
            $stmt = $this->pdo->prepare($sql);
            $stmt->bindParam(':id', $id, PDO::PARAM_INT);
            if ($stmt->execute()) {
                return $this->response(true, "Record deleted successfully.");
            } else {
                return $this->response(false, "Failed to delete record.");
            }
        } catch (PDOException $e) {
            return $this->response(false, $e->getMessage());
        }
    }

    private function response($success, $message)
    {
        return [
            'success' => $success,
            'message' => $message
        ];
    }
}
