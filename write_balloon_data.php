<?PHP


$dir = 'data';
$filenameBase = 'balloon_data';

$data = $_POST["data"];
$dataArray = explode(',', $data);
$pID = $dataArray[0];

$commonFilename = $filenameBase . ".csv";
$filename = $dir . "/" . $filenameBase . "_" . $pID . ".csv";


// Save to common data file
@ $fp = fopen($commonFilename, 'a+');
if (!$fp)
{
    echo 'Cannot create data file';
    exit;
} 
else
{
	fwrite($fp, $data);
	// echo "The data has been sent.";
}


// Save to individual file for backup
@ $fp = fopen($filename, 'a+');
if (!$fp)
{
    echo 'Cannot create individual data file';
    exit;
}
else
{
	fwrite($fp, $data);
	// echo "The data has been sent.";
}

?>