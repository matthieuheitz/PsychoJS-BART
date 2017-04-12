<?PHP


$dir = 'data';
$filenameBase = 'overall_data';

session_start();
if($_POST['csrfKey'] != $_SESSION['csrfKey']) {
	die("Unauthorized source!");
}

$data = $_POST["data"];
$dataArray = explode(',', $data);
$pID = $dataArray[0];

$commonFilename = $filenameBase . ".csv";
$filename = $dir . "/" . $filenameBase . "_" . $pID . ".csv";


// Save to individual file for backup
@ $fp = fopen($filename, 'a+');
if (!$fp)
{
    echo 'Cannot create individual data file';
}
else
{
	fwrite($fp, $data);
	// echo "The data has been sent.";
}

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
	echo "The data has been sent.";
}


?>