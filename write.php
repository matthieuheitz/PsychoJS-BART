<?PHP
$filename = 'log.txt';

@ $fp = fopen($filename, 'wb');
if (!$fp)
{
    echo 'Cannot generate message file';
    exit;
} 
else
{
fwrite($fp, $_POST["data"]);
Echo "Message send";
}
?>