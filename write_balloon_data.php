<?PHP
$filename = 'balloon_data.csv';

@ $fp = fopen($filename, 'a+');
if (!$fp)
{
    echo 'Cannot create data file';
    exit;
} 
else
{
	fwrite($fp, $_POST["data"] . "\n");
	echo "The data has been sent.";
}
?>