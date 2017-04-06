<?PHP
$filename = 'log.txt';

@ $fp = fopen($filename, 'a+');
if (!$fp)
{
    echo 'Cannot generate message file';
    exit;
} 
else
{
fwrite($fp, $_POST["data"] . "\n");
Echo "Message send";
}
?>