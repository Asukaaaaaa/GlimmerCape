

$("a").click(function(){
    alert("dian")
});




$(function() {
    // Set up tour

	if($('#walkthrough-p8-1').is(':hidden')){

      //如果隐藏时。。。
	  alert("walkthrough-p8-1隐藏")

}else{

      //如果显示时。。。
 alert("walkthrough-p8-1显示")
}

	
	
    $('body').pagewalkthrough({
        name: 'introduction',
        steps: [{
           popup: {
               content: '#walkthrough-0',
               type: 'modal',
			   // autoScroll:true,
			   // scrollSpeed:3000
           },

        },  {
            wrapper: '.p1-1',
            popup: {
                content: '#walkthrough-p1-1',
                type: 'tooltip',
                position: 'top',
				// autoScroll:true,
				 // scrollSpeed:3000
            },
			 <!-- $("#p1").style(display,"none") -->
        }, {
            wrapper: '.p2-1',
            popup: {
                content: '#walkthrough-p2-1',
                type: 'tooltip',
                position: 'left',
				// autoScroll:true.
				 // scrollSpeed:3000
            }
        },{
            wrapper: '.p3-1',
            popup: {
                content: '#walkthrough-p3-1',
                type: 'tooltip',
                position: 'left',
				autoScroll:true
            }
        },{
            wrapper: '.p3-2',
            popup: {
                content: '#walkthrough-p3-2',
                type: 'tooltip',
                position: 'right'
            }
        },{
            wrapper: '.p4-1',
            popup: {
                content: '#walkthrough-p4-1',
                type: 'tooltip',
                position: 'left'
            }
        },{
            wrapper: '.p5-1',
            popup: {
                content: '#walkthrough-p5-1',
                type: 'tooltip',
                position: 'left'
            }
        },{
            wrapper: '.p6-1',
            popup: {
                content: '#walkthrough-p6-1',
                type: 'tooltip',
                position: 'top'
            }
        },{
            wrapper: '.p6-2',
            popup: {
                content: '#walkthrough-p6-2',
                type: 'tooltip',
                position: 'right'
            }
        },{
            wrapper: '.p6-3',
            popup: {
                content: '#walkthrough-p6-3',
                type: 'tooltip',
                position: 'left'
            }
        },{
            wrapper: '.p6-4',
            popup: {
                content: '#walkthrough-p6-4',
                type: 'tooltip',
                position: 'left'
            }
        },{
            wrapper: '.p6-5',
            popup: {
                content: '#walkthrough-p6-5',
                type: 'tooltip',
                position: 'left'
            }
        },{
            wrapper: '.p7-1',
            popup: {
                content: '#walkthrough-p7-1',
                type: 'tooltip',
                position: 'left'
            }
        },{
            wrapper: '.p7-2',
            popup: {
                content: '#walkthrough-p7-2',
                type: 'tooltip',
                position: 'right'
            }
        },{
            wrapper: '.p8-1',
            popup: {
                content: '#walkthrough-p8-1',
                type: 'tooltip',
                position: 'right'
            }
        },{
            wrapper: '.p8-2',
            popup: {
                content: '#walkthrough-p8-2',
                type: 'tooltip',
                position: 'right'
            }
        },{
            wrapper: '.p8-3',
            popup: {
                content: '#walkthrough-p8-3',
                type: 'tooltip',
                position: 'left'
            }
        },{
            wrapper: '.p8-4',
            popup: {
                content: '#walkthrough-p8-4',
                type: 'tooltip',
                position: 'left'
            },
			autoScroll: true,
      scrollSpeed: 1000,

        }
		
		
		
		
		
		
		
		],
		 buttons: {
        jpwClose: {
            i18n: "点击关闭"
        },
        jpwNext: {
            i18n: "下一步 &rarr;"
        },
        jpwPrevious: {
            i18n: "&larr; 上一步"
        },
        jpwFinish: {
            i18n: "完成 &#10004;"
        }
    }

    });

    // Show the tour
    $('body').pagewalkthrough('show');
});
