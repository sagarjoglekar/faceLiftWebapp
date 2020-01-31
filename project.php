<?php include "conf.php";?>

<!DOCTYPE html>
<html>
  
  <head>
    
    <title>facelift | beautifying the world </title>
    <meta name="viewport" content="initial-scale=1.0, user-scalable=no" />
    <meta http-equiv="content-type" content="text/html; charset=UTF-8"/>
    <link rel="shortcut icon" href="http://cartodb.com/assets/favicon.ico" />
    

       <!--  ADDED FROM GOODCITYLIFE -->
    <link href='http://fonts.googleapis.com/css?family=Abel|Source+Sans+Pro:400,300,300italic,400italic,600,600italic,700,700italic,900,900italic,200italic,200' rel='stylesheet' type='text/css'>

    <link href="../css/bootstrap.min.css" rel="stylesheet">
    <link href="../css/magnific-popup.css" rel="stylesheet">
    <link href="../css/shortcodes/shortcodes.css" rel="stylesheet">
    <link href="../css/owl.carousel.css" rel="stylesheet">
    <link href="../css/owl.theme.css" rel="stylesheet">
    <link href="../css/style.css?v=1" rel="stylesheet">
    <link href="../css/style-responsive.css" rel="stylesheet">
    <link href="../css/default-theme.css?v=1" rel="stylesheet">
    <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css" rel="stylesheet">    
    <link href="../css/custom.css" rel="stylesheet">    

    
    <!-- SCRIPTS -->
    <script src='scripts/config.js'></script>
    <script src="../js/jquery-2.1.4.min.js"></script>
    <script src="../js/bootstrap.min.js"></script>
    <!-- FROM GOODCITYLIFE -->
    <script src="../js/jquery.flexslider-min.js"></script>
    <script src="../js/menuzord.js"></script>
    <script src="../js/jquery.isotope.js"></script>
    <script src="../js/jquery.magnific-popup.min.js"></script>
    <script src="../js/imagesloaded.js"></script>
    <!--common scripts-->
    <script src="../js/scripts.js?8"></script>
        <script src="../js/jquery.countTo.js"></script>
        <script src="../js/visible.js"></script>
        <script src="../js/smooth.js"></script>
        <script src="../js/wow.min.js"></script>   
        <script src="../js/owl.carousel.min.js"></script>
    <!--
        <script src="../js/jquery.countTo.js"></script>
        <script src="../js/visible.js"></script>
        <script src="../js/smooth.js"></script>
        <script src="../js/wow.min.js"></script>   
        <script src="../js/owl.carousel.min.js"></script>
    -->

    <!-- HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="js/html5shiv.js"></script>
    <script src="js/respond.min.js"></script>
    <![endif]-->

  </head>

  <body>

    <?php include $BASE.'/header.php';?>

    <section class="body-content">



            <div class="page-content count-parallax">


            <div class="container">
                <div class="row text-center">

                    <div>
                        <div>
                            <h3><b>FACELIFT</b> | Beautifying the world</h3>
                        </div>

                    </div>
                </div>

            </div>


            <a name="description"></a>
                <div class="page-content" style="background-color:#FFF;">
                    <div class="container">
                        <div class="row col-md-10 col-md-offset-1">

                        	<p>AI algorithms have been used to predict whether people are likely to find a particular urban scene pleasant or not by learning from known human preferences. Indeed, there are specific urban elements that are universally considered beautiful: from greenery, to small streets, to memorable spaces.</p>

							<p>A work by scientists at Nokia Bell Labs Cambridge have now gone beyond that by building algorithms that are able to automatically  recreate beauty rather than simply assessing it. They built a deep learning framework (which they named FaceLift) that is able to both beautify existing urban scenes (existing Google Street views) and explain which urban elements make those transformed scenes beautiful.</p>

							<p>The team assembled 20,000 images of Google street views that volunteers had labelled as beautiful or ugly. They then fed all these images into a computer running a deep learning framework – a kind of algorithm that mimics the human brain by processing data in neural networks. In so doing, the algorithm learned what humans thought was ugly or beautiful and, based on that, it was asked to improve an ugly scene, which it did using a generative adversarial network - a relatively recent class of algorithms that is currently used to recreate “fake” yet realistic human faces. The resulting images were then matched to the most closely corresponding images of real spaces. Finally, the algorithm explained how the addition and removal of specific urban elements had made the scene more beautiful.</p> 

							<p>FaceLift is able to generate beautified scenes extremely fast (in seconds) and at scale (for an entire city). User studies showed that, with FaceLift, urban planners ended up considering alternative approaches to urban interventions that might have not been otherwise apparent, and city residents were able to visually assess the impact of  micro-interventions in their neighborhoods.</p>

							<p>Find an interactive map <?php echo "<a href='{$BASE}/facelift/index.php'>";?>here</a>, while publications and datasets are available below.</p>
                
                        </div>
                    </div>
                </div>



            <a name="publications"></a>
                <div class="page-content" style="background-color:#EFEFEF;">
                    <div class="container">
                        <div class="row col-md-10 col-md-offset-1">
                            <div class="heading-title text-center border-short-bottom">
                                <h3 class="text-uppercase">Publications</h3>
                            </div>
                            <ul>
                                <li style="text-decoration:none;">
                                    <p>Sagar Joglekar, Daniele Quercia, Miriam Redi, Luca Maria Aiello, Tobias Kauer, Nishanth Sastry<br/>
                                     <a href="https://royalsocietypublishing.org/doi/pdf/10.1098/rsos.190987"><b>FaceLift: a transparent deeplearning framework tobeautify urban scenes</b></a><br/> 
                                     Royal Society Open Science, 2020</p> 
                                </li>

                           		<li style="text-decoration:none;">
                                    <p>Tobias Kauer, Sagar Joglekar, Miriam Redi, Luca Maria Aiello, Daniele Quercia<br/>
                                     <a href="https://social-dynamics.net/docs/deep_beautification.pdf"><b>Mapping and Visualizing Deep-Learning Urban Beautification</b></a><br/> 
                                     IEEE computer graphics and applications, 2018</p> 
                                </li>
                            </ul>    
                            
                        </div>
                    </div>
                </div>

      		<a name="Data"></a>
                <div class="page-content">
                    <div class="container">
                        <div class="row col-md-10 col-md-offset-1">
                            <div class="heading-title text-center border-short-bottom">
                                <h3 class="text-uppercase">Data</h3>
                            </div>
                            <ul>
                                <li style="text-decoration:none;">
                                    <p>Download models, data, and analysis code : <a href="https://goodcitylife.org/data.php"><b>From here</b></a></p> 
                                </li>
                            </ul>    
                            
                        </div>
                    </div>
                </div>

            <a name="press"></a>
                <div class="page-content" style="background-color:#EFEFEF;">
                    <div class="container">
                        <div class="row col-md-10 col-md-offset-1">
                            <div class="heading-title text-center border-short-bottom">
                                <h3 class="text-uppercase">In the press</h3>
                            </div>
                            <ul class="nobullet press">
                                <li><a href="https://cosmosmagazine.com/technology/want-to-beautify-your-street-ask-a-computer" target="_blank">Want to beautify your street? Ask a computer</a> | Cosmos Magazine</li>
                            </ul>
                        </div>
                    </div>
                </div>



        </div>






    </section>


    
        
    <?php include $BASE.'/footer.php';?>
 
    
    

  </body>
</html>